from __future__ import annotations

import json
import os
import re
import shlex
import subprocess
import sys
from pathlib import Path
from typing import List, Tuple

ROOT = Path(__file__).resolve().parents[1]
GENERATED = ROOT / "generated-assets"
MASTER_DIR = GENERATED / "master"
TEMP_DIR = MASTER_DIR / "temp"


def run(cmd: List[str]) -> None:
    process = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="ignore")
    if process.returncode != 0:
        raise RuntimeError(f"Command failed: {' '.join(shlex.quote(c) for c in cmd)}\n{process.stdout}\n{process.stderr}")


def ffmpeg_bin() -> Path:
    from shutil import which

    env_ffmpeg = os.environ.get("FFMPEG_BIN")
    if env_ffmpeg:
        return Path(env_ffmpeg)
    system_ffmpeg = which("ffmpeg")
    if system_ffmpeg:
        return Path(system_ffmpeg)
    local_python_packages = ROOT / ".python-packages"
    if local_python_packages.exists():
        sys.path.insert(0, str(local_python_packages))
    import imageio_ffmpeg  # type: ignore

    return Path(imageio_ffmpeg.get_ffmpeg_exe())


def media_duration_seconds(ffmpeg: Path, media: Path) -> float:
    process = subprocess.run([str(ffmpeg), "-i", str(media)], capture_output=True, text=True, encoding="utf-8", errors="ignore")
    output = f"{process.stdout}\n{process.stderr}"
    m = re.search(r"Duration:\s*(\d+):(\d+):(\d+\.\d+)", output)
    if not m:
        raise RuntimeError(f"Unable to detect duration for {media}")
    h, mnt, sec = m.groups()
    return int(h) * 3600 + int(mnt) * 60 + float(sec)


def numeric_order(path: Path) -> Tuple[int, str]:
    m = re.search(r"(\d+)", path.name)
    return (int(m.group(1)), path.name) if m else (9999, path.name)


def gather_assets() -> dict:
    videos = sorted((GENERATED / "video-bg").glob("*.mp4"), key=numeric_order)
    images = sorted((GENERATED / "images").glob("*.jpg"), key=numeric_order)
    voices = sorted((GENERATED / "voices").glob("*.wav"), key=numeric_order)
    tracks_m4a = sorted((GENERATED / "music-tracks").glob("*.m4a"), key=numeric_order)
    bed_mp3 = next((GENERATED / "music-tracks").glob("TRACK 01*.mp3"), None)
    if not videos or not images or not voices or not tracks_m4a or bed_mp3 is None:
        raise RuntimeError("Missing required generated assets")
    return {
        "videos": videos,
        "images": images,
        "voices": voices,
        "tracks_m4a": tracks_m4a,
        "bed_mp3": bed_mp3,
    }


def normalize_videos(ffmpeg: Path, videos: List[Path], playback_rate: float = 0.85, max_segment_seconds: float = 8.0) -> Tuple[List[Path], List[float]]:
    clips: List[Path] = []
    durations: List[float] = []
    for idx, video in enumerate(videos):
        src_duration = media_duration_seconds(ffmpeg, video) / playback_rate
        seg_duration = min(max_segment_seconds, src_duration)
        out = TEMP_DIR / f"clip_{idx:03d}.mp4"
        run([
            str(ffmpeg),
            "-y",
            "-i",
            str(video),
            "-t",
            f"{seg_duration:.3f}",
            "-vf",
            f"scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,setpts=PTS/{playback_rate},format=yuv420p",
            "-r",
            "24",
            "-an",
            "-c:v",
            "libx264",
            "-preset",
            "ultrafast",
            "-crf",
            "24",
            str(out),
        ])
        clips.append(out)
        durations.append(seg_duration)
    return clips, durations


def concat_videos(ffmpeg: Path, clips: List[Path]) -> Path:
    list_file = TEMP_DIR / "concat_list.txt"
    list_file.write_text("\n".join([f"file '{c.as_posix()}'" for c in clips]), encoding="utf-8")
    out = TEMP_DIR / "base_video.mp4"
    run([
        str(ffmpeg),
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        str(list_file),
        "-c:v",
        "libx264",
        "-preset",
        "ultrafast",
        "-crf",
        "23",
        str(out),
    ])
    return out


def assign_scene_tracks(scene_count: int, tracks: List[Path]) -> List[Path]:
    selected: List[Path] = []
    i = 0
    while len(selected) < scene_count:
        selected.append(tracks[i % len(tracks)])
        i += 1
    return selected


def build_master(ffmpeg: Path, base_video: Path, assets: dict, segment_durations: List[float]) -> Path:
    output = MASTER_DIR / "OSIRIS_CINEMATIC_MASTER.mp4"
    videos: List[Path] = assets["videos"]
    images: List[Path] = assets["images"]
    voices: List[Path] = assets["voices"]
    tracks_m4a: List[Path] = assets["tracks_m4a"]
    bed_mp3: Path = assets["bed_mp3"]

    total_duration = sum(segment_durations)
    segment_starts: List[float] = []
    t = 0.0
    for d in segment_durations:
        segment_starts.append(t)
        t += d

    scene_tracks = assign_scene_tracks(len(videos), tracks_m4a)

    image_windows: List[Tuple[float, float]] = []
    span = total_duration / len(images)
    for i in range(len(images)):
        start = i * span
        end = min(total_duration, start + span)
        image_windows.append((start, end))

    voice_durations = [min(6.0, media_duration_seconds(ffmpeg, v)) for v in voices]
    voice_video_map = [2, 2, 3, 3, 11, 8, 7, 10, 12, 12, 10, 12, 10, 11, 12, 6]
    voice_starts: List[float] = []
    for i, dur in enumerate(voice_durations):
        vid_idx = max(0, min(len(videos) - 1, voice_video_map[i]))
        seg_start = segment_starts[vid_idx]
        seg_len = segment_durations[vid_idx]
        offset = min(seg_len - dur - 0.2, max(0.2, seg_len * ((i % 3) + 1) / 4.5))
        voice_starts.append(max(0.0, seg_start + max(0.0, offset)))

    inputs: List[str] = ["-i", str(base_video)]
    for img in images:
        inputs += ["-loop", "1", "-i", str(img)]
    inputs += ["-stream_loop", "-1", "-i", str(bed_mp3)]
    for tr in scene_tracks:
        inputs += ["-i", str(tr)]
    for vo in voices:
        inputs += ["-i", str(vo)]

    chains: List[str] = []
    current_video = "[0:v]"
    for idx, (win, _) in enumerate(zip(image_windows, images), start=1):
        start, end = win
        fade_out = max(start + 0.5, end - 1.0)
        img_label = f"img{idx}"
        out_label = f"v{idx}"
        chains.append(f"[{idx}:v]scale=1280:720,format=rgba,colorchannelmixer=aa=0.18,fade=t=in:st={start:.3f}:d=0.9:alpha=1,fade=t=out:st={fade_out:.3f}:d=0.9:alpha=1[{img_label}]")
        chains.append(f"{current_video}[{img_label}]overlay=0:0:shortest=1[{out_label}]")
        current_video = f"[{out_label}]"

    bed_idx = 1 + len(images)
    scene_idx_start = bed_idx + 1
    voice_idx_start = scene_idx_start + len(scene_tracks)

    scene_labels: List[str] = []
    for i, (start, dur, _) in enumerate(zip(segment_starts, segment_durations, scene_tracks)):
        inp = scene_idx_start + i
        fade_out = max(1.6, dur - 1.5)
        lbl = f"sc{i}"
        scene_labels.append(f"[{lbl}]")
        chains.append(f"[{inp}:a]atrim=0:{dur:.3f},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=1.5,afade=t=out:st={fade_out:.3f}:d=1.5,adelay={int(start*1000)}|{int(start*1000)},volume=1.0[{lbl}]")

    voice_labels: List[str] = []
    for i, (start, dur) in enumerate(zip(voice_starts, voice_durations)):
        inp = voice_idx_start + i
        lbl = f"vo{i}"
        voice_labels.append(f"[{lbl}]")
        chains.append(f"[{inp}:a]atrim=0:{dur:.3f},asetpts=PTS-STARTPTS,adelay={int(start*1000)}|{int(start*1000)},volume=1.12[{lbl}]")

    chains.append(f"[{bed_idx}:a]atrim=0:{total_duration:.3f},asetpts=PTS-STARTPTS,volume=1.0[bedraw]")
    mix_labels = "[bedraw]" + "".join(scene_labels) + "".join(voice_labels)
    mix_count = 1 + len(scene_labels) + len(voice_labels)
    chains.append(f"{mix_labels}amix=inputs={mix_count}:dropout_transition=0:normalize=0,alimiter=limit=0.95[aout]")

    run([
        str(ffmpeg),
        "-y",
        *inputs,
        "-filter_complex",
        ";".join(chains),
        "-map",
        current_video,
        "-map",
        "[aout]",
        "-t",
        f"{total_duration:.3f}",
        "-r",
        "24",
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "22",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        "256k",
        "-movflags",
        "+faststart",
        str(output),
    ])

    cues = {
        "master_file": str(output),
        "total_duration_seconds": round(total_duration, 3),
        "video_segments": [
            {
                "video": str(videos[i]),
                "start": round(segment_starts[i], 3),
                "duration": round(segment_durations[i], 3),
                "scene_track": str(scene_tracks[i]),
            }
            for i in range(len(videos))
        ],
        "voice_cues": [
            {
                "voice": str(voices[i]),
                "timestamp": round(voice_starts[i], 3),
                "duration": round(voice_durations[i], 3),
            }
            for i in range(len(voices))
        ],
        "image_overlays": [
            {
                "image": str(images[i]),
                "start": round(image_windows[i][0], 3),
                "end": round(image_windows[i][1], 3),
            }
            for i in range(len(images))
        ],
        "music_bed": str(bed_mp3),
        "layering": "TRACK 01 continuous bed with scene-track crossfades of 1.5s",
    }
    (MASTER_DIR / "OSIRIS_CINEMATIC_MASTER_CUES.json").write_text(json.dumps(cues, ensure_ascii=False, indent=2), encoding="utf-8")

    return output


def main() -> None:
    MASTER_DIR.mkdir(parents=True, exist_ok=True)
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
    ffmpeg = ffmpeg_bin()
    assets = gather_assets()
    clips, segment_durations = normalize_videos(ffmpeg, assets["videos"])
    base = concat_videos(ffmpeg, clips)
    out = build_master(ffmpeg, base, assets, segment_durations)
    print(str(out))


if __name__ == "__main__":
    main()
