import { createAssetProxy } from "./assetOverrides";

const RAW_ASSET_URLS = {
  audio: {
    main_theme: "/music/TRACK-01.mp3",
    intro_narration: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/aud_intro_narration_e17de323.wav",
    intro_narration_v1: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/aud_intro_narration_v1_2522b4cb.wav",
    yahya_monologue: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/aud_yahya_monologue_4cc9724c.wav",
    tragic_sacrifice: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/aud_tragic_sacrifice_8f3e2a1c.wav",
    cosmic_end: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/aud_cosmic_end_b4e9f2d1.wav",
  },
  video: {
    logo_reveal: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/vid_logo_reveal_e046ce72.mp4",
    qabil_scene: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/vid_qabil_scene_cf2f94d4.mp4",
  },
  videoBg: {
    intro: "/video-bg/VIDEO%2001%20%E2%80%94%20%D8%A7%D9%84%D8%B4%D8%A7%D8%B4%D8%A9%20%D8%A7%D9%84%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A%D8%A9%20(Intro).mp4",
    yahya_room: "/video-bg/VIDEO%2002%20%E2%80%94%20%D8%BA%D8%B1%D9%81%D8%A9%20%D9%8A%D8%AD%D9%8A%D9%89%20(%D8%A7%D9%84%D9%85%D8%B4%D9%87%D8%AF%20%D8%A7%D9%84%D8%A7%D9%81%D8%AA%D8%AA%D8%A7%D8%AD%D9%8A).mp4",
    cosmic_opening: "/video-bg/VIDEO%2003%20%E2%80%94%20%D8%A7%D9%84%D9%81%D8%B6%D8%A7%D8%A1%20%D8%A7%D9%84%D9%83%D9%88%D9%86%D9%8A%20(%D8%A7%D9%84%D9%85%D8%B1%D8%A7%D9%81%D8%B9%D8%A9%20%D8%A7%D9%84%D8%A7%D9%81%D8%AA%D8%AA%D8%A7%D8%AD%D9%8A%D8%A9).mp4",
    tarek_rooftop: "/video-bg/VIDEO%2004%20%E2%80%94%20%D8%B3%D8%B7%D8%AD%20%D8%A7%D9%84%D9%85%D8%A8%D9%86%D9%89%20(%D9%88%D8%AF%D8%A7%D8%B9%20%D8%B7%D8%A7%D8%B1%D9%82).mp4",
    sinai_desert: "/video-bg/VIDEO%2005%20%E2%80%94%20%D8%B5%D8%AD%D8%B1%D8%A7%D8%A1%20%D8%B3%D9%8A%D9%86%D8%A7%D8%A1%20(%D8%A7%D9%84%D8%B9%D8%AC%D9%84%20%D8%A7%D9%84%D8%B0%D9%87%D8%A8%D9%8A).mp4",
    molten_gold: "/video-bg/VIDEO%2006%20%E2%80%94%20%D8%B5%D9%87%D8%B1%20%D8%A7%D9%84%D8%B0%D9%87%D8%A8%20(%D9%87%D9%86%D8%AF%D8%B3%D8%A9%20%D8%A7%D9%84%D8%AD%D8%B4%D9%88%D8%AF).mp4",
    nicaea: "/video-bg/VIDEO%2007%20%E2%80%94%20%D9%85%D8%AC%D9%85%D8%B9%20%D9%86%D9%8A%D9%82%D9%8A%D8%A9%20(%D8%A7%D9%84%D8%A5%D9%85%D8%A8%D8%B1%D8%A7%D8%B7%D9%88%D8%B1%20%D9%88%D8%A7%D9%84%D8%AD%D9%83%D9%8A%D9%85).mp4",
    andalusia: "/video-bg/VIDEO%2008%20%E2%80%94%20%D8%A7%D9%84%D8%A3%D9%86%D8%AF%D9%84%D8%B3%20(%D8%AC%D9%85%D8%A7%D9%84%20%D9%8A%D8%AA%D9%84%D8%A7%D8%B4%D9%89).mp4",
    abu_abdullah_tears: "/video-bg/VIDEO%2009%20%E2%80%94%20%D8%AF%D9%85%D9%88%D8%B9%20%D8%A3%D8%A8%D9%88%20%D8%B9%D8%A8%D8%AF%20%D8%A7%D9%84%D9%84%D9%87%20(%D8%B2%D9%81%D8%B1%D8%A9%20%D8%A7%D9%84%D8%B9%D8%B1%D8%A8%D9%8A%20%D8%A7%D9%84%D8%A3%D8%AE%D9%8A%D8%B1%D8%A9).mp4",
    berlin_1933: "/video-bg/VIDEO%2010%20%E2%80%94%20%D8%A8%D8%B1%D9%84%D9%8A%D9%86%201933%20(%D8%A7%D9%84%D9%83%D8%A8%D8%B1%20%D9%8A%D8%B5%D8%A8%D8%AD%20%D9%86%D8%B8%D8%A7%D9%85%D8%A7%D9%8B).mp4",
    karbala: "/video-bg/VIDEO%2011%20%E2%80%94%20%D9%83%D8%B1%D8%A8%D9%84%D8%A7%D8%A1%20(%D8%A7%D9%84%D8%AD%D9%82%20%D8%A7%D9%84%D8%A3%D8%B9%D8%B2%D9%84).mp4",
    digital_space: "/video-bg/VIDEO%2012%20%E2%80%94%20%D8%A7%D9%84%D9%81%D8%B6%D8%A7%D8%A1%20%D8%A7%D9%84%D8%B1%D9%82%D9%85%D9%8A%20(%D8%A7%D9%84%D9%85%D9%88%D8%A7%D8%AC%D9%87%D8%A9%20%D9%85%D8%B9%20%D8%A7%D9%84%D9%85%D9%87%D9%86%D8%AF%D8%B3).mp4",
    enter_key: "/video-bg/VIDEO%2013%20%E2%80%94%20%D8%B6%D8%BA%D8%B7%D8%A9%20Enter%20(%D8%A7%D9%84%D8%AA%D8%B6%D8%AD%D9%8A%D8%A9%20%D8%A7%D9%84%D9%86%D9%87%D8%A7%D8%A6%D9%8A%D8%A9).mp4",
  },
  backgrounds: {
    berlin_1933: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_berlin_1933_a86c8d1e.png",
    cambodia_1975: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_cambodia_1975_c5282e82.png",
    corporate_lab: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_corporate_lab_2db6685d.png",
    granada_fall: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_granada_fall_582e149f.png",
    moscow_1937: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_moscow_1937_ee9ff2ff.png",
    nicaea_council: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_nicaea_council_f4ebd953.png",
    osiris_cosmic: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_osiris_cosmic_61c9c5b0.png",
    osiris_interface: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_osiris_interface_d275313a.png",
    pharaoh_temple: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_pharaoh_temple_98bcc51c.png",
    qabil_habil_aftermath: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_qabil_habil_aftermath_4d071a34.png",
    qabil_habil_altar: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_qabil_habil_altar_87782666.png",
    qabil_habil_rage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_qabil_habil_rage_d1f7e300.png",
    white_space: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_white_space_1c056d5f.png",
    yahya_apartment: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_yahya_apartment_43c987a4.png",
  },
  characters: {
    narrator: "/generated-assets/characters/الراوي الكوني-التجسيد البصري (Visual Representation).png",
    arius: "/generated-assets/characters/آريوس.jpeg",
    athanasius: "/generated-assets/characters/أثناسيوس.jpeg",
    samiri: "/generated-assets/characters/السامري-الصورة الأساسية (Portrait).jpeg",
    samiri_calf: "/generated-assets/characters/السامري-اصورة صناعة العجل (The Golden Calf Scene).png",
    first_engineer: "/generated-assets/characters/المهندس الأول-الصورة الأساسية (Portrait).jpeg",
    first_engineer_2: "/generated-assets/characters/المهندس الأول-الصورة الأساسية (Portrait)02.jpeg",
    first_engineer_confront: "/generated-assets/characters/المهندس الأول-صورة المواجهة (Confrontation).jpeg",
    first_engineer_exposed: "/generated-assets/characters/المهندس الأول-صورة الانكشاف (Exposed — Final Scene).jpeg",
    tarek: "/generated-assets/characters/طارق الراشد-الصورة الأساسية (Portrait).jpeg",
    tarek_ghost: "/generated-assets/characters/طارق الراشد-صورة التسجيل (Recording — Ghost Image).jpeg",
    tarek_dream: "/generated-assets/characters/طارق الراشد-صورة الحلم (Dream Sequence).jpeg",
    constantine: "/generated-assets/characters/قسطنطين-الصورة الأساسية (Portrait).jpeg",
    laila: "/generated-assets/characters/ليلى حسنالصورة الأساسية (Portrait).jpeg",
    laila_faith: "/generated-assets/characters/ليلى حسن-صورة الإيمان (Faith Portrait).jpeg",
    laila_witness: "/generated-assets/characters/ليلى حسن-صورة الشاهدة (Witness Scene — Final Chapter).jpeg",
    yahya: "/generated-assets/characters/يحيى الراشد-الصورة الأساسية (Portrait).jpeg",
    yahya_breakdown: "/generated-assets/characters/يحيى الراشد-صورة الانهيار (Breakdown Scene).jpeg",
    yahya_confront: "/generated-assets/characters/يحيى الراشد-صورة المواجهة (Confrontation Scene).jpeg",
    yahya_dying: "/generated-assets/characters/يحيى الراشد-صورة الاحتضار (Dying Scene).jpeg",
    laila_crying: "/generated-assets/characters/ليلى حسن-صورة البكاء (Crying Scene).jpeg",
    ramses: "/generated-assets/characters/الراوي الكوني-التجسيد البصري (Visual Representation).png",
    yahya_main: "/generated-assets/characters/يحيى الراشد-الصورة الأساسية (Portrait).jpeg",
    abu_abdullah: "/generated-assets/characters/الراوي الكوني-التجسيد البصري (Visual Representation).png",
    dictator: "/generated-assets/characters/الراوي الكوني-التجسيد البصري (Visual Representation).png",
  },
  documents: {
    encrypted_file: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/doc_encrypted_file_c10f4f48.png",
    facebook_leak: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/doc_facebook_leak_64b7fcbd.png",
    kgb_order: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/doc_kgb_order_e0f72fd0.png",
    nicaea_scroll: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/doc_nicaea_scroll_2f133ee9.png",
    ramses_carving: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/doc_ramses_carving_eb77dd87.png",
  },
  ui: {
    logo_icon: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/ui_logo_icon_c1fb9bc2.png",
    logo_primary: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/ui_logo_primary_084de0f8.png",
    logo_dark: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/ui_logo_dark_e0eb7967.png",
    bg_pattern: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/ui_bg_pattern_739a77da.png",
  },
  projectMedia: {
    audio: {
      track_01_mp3: "/music/TRACK%2001%20%E2%80%94%20%D8%A7%D9%84%D8%AB%D9%8A%D9%85%20%D8%A7%D9%84%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A%20%D9%84%D9%84%D8%B1%D9%88%D8%A7%D9%8A%D8%A9.mp3",
      track_01_m4a: "/music/TRACK%2001%20%E2%80%94%20%D8%A7%D9%84%D8%AB%D9%8A%D9%85%20%D8%A7%D9%84%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A%20%D9%84%D9%84%D8%B1%D9%88%D8%A7%D9%8A%D8%A9.m4a",
      track_02_m4a: "/music/TRACK%2002%20%E2%80%94%20%D8%A7%D9%84%D8%AC%D8%B2%D8%A1%20%D8%A7%D9%84%D8%B5%D9%81%D8%B1-%D8%BA%D8%B1%D9%81%D8%A9%20%D8%A7%D9%84%D9%85%D8%AD%D8%A7%D9%83%D9%85%D8%A9%20%D8%A7%D9%84%D9%83%D9%88%D9%86%D9%8A%D8%A9.m4a",
      track_03_m4a: "/music/TRACK%2003.m4a",
      track_04_m4a: "/music/TRACK-04.m4a",
      track_05_m4a: "/music/TRACK%2005.m4a",
      track_06_m4a: "/music/TRACK%2006.m4a",
      track_07_m4a: "/music/TRACK%2007.m4a",
      track_08_m4a: "/music/TRACK%2008.m4a",
      track_09_m4a: "/music/TRACK%2009.m4a",
      track_10_m4a: "/music/TRACK%2010.m4a",
      track_11_m4a: "/music/TRACK%2011.m4a",
      track_12_m4a: "/music/TRACK%2012.m4a",
      track_13_m4a: "/music/TRACK%2013.m4a",
      track_14_m4a: "/music/TRACK%2014.m4a",
      voice_01_wav: "/music/VOICE%2001%20%E2%80%94%20%D8%A7%D9%84%D9%85%D8%B1%D8%A7%D9%81%D8%B9%D8%A9%20%D8%A7%D9%84%D8%A7%D9%81%D8%AA%D8%AA%D8%A7%D8%AD%D9%8A%D8%A9%20(%D8%A7%D9%84%D8%A3%D9%8A%D9%82%D9%88%D9%86%D9%8A%D8%A9%20%D8%A7%D9%84%D9%83%D8%A8%D8%B1%D9%89).wav",
      devil_voice_m4a: "/music/devil-voice-to-clone.m4a",
      devil_voice_wav: "/music/devil-voice-to-clone.wav",
    },
    video: {
      video_01_intro: "/video-bg/VIDEO%2001%20%E2%80%94%20%D8%A7%D9%84%D8%B4%D8%A7%D8%B4%D8%A9%20%D8%A7%D9%84%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A%D8%A9%20(Intro).mp4",
      video_02_yahya_room: "/video-bg/VIDEO%2002%20%E2%80%94%20%D8%BA%D8%B1%D9%81%D8%A9%20%D9%8A%D8%AD%D9%8A%D9%89%20(%D8%A7%D9%84%D9%85%D8%B4%D9%87%D8%AF%20%D8%A7%D9%84%D8%A7%D9%81%D8%AA%D8%AA%D8%A7%D8%AD%D9%8A).mp4",
      video_03_cosmic_opening: "/video-bg/VIDEO%2003%20%E2%80%94%20%D8%A7%D9%84%D9%81%D8%B6%D8%A7%D8%A1%20%D8%A7%D9%84%D9%83%D9%88%D9%86%D9%8A%20(%D8%A7%D9%84%D9%85%D8%B1%D8%A7%D9%81%D8%B9%D8%A9%20%D8%A7%D9%84%D8%A7%D9%81%D8%AA%D8%AA%D8%A7%D8%AD%D9%8A%D8%A9).mp4",
      video_04_tarek_rooftop: "/video-bg/VIDEO%2004%20%E2%80%94%20%D8%B3%D8%B7%D8%AD%20%D8%A7%D9%84%D9%85%D8%A8%D9%86%D9%89%20(%D9%88%D8%AF%D8%A7%D8%B9%20%D8%B7%D8%A7%D8%B1%D9%82).mp4",
      video_05_sinai_desert: "/video-bg/VIDEO%2005%20%E2%80%94%20%D8%B5%D8%AD%D8%B1%D8%A7%D8%A1%20%D8%B3%D9%8A%D9%86%D8%A7%D8%A1%20(%D8%A7%D9%84%D8%B9%D8%AC%D9%84%20%D8%A7%D9%84%D8%B0%D9%87%D8%A8%D9%8A).mp4",
      video_06_molten_gold: "/video-bg/VIDEO%2006%20%E2%80%94%20%D8%B5%D9%87%D8%B1%20%D8%A7%D9%84%D8%B0%D9%87%D8%A8%20(%D9%87%D9%86%D8%AF%D8%B3%D8%A9%20%D8%A7%D9%84%D8%AD%D8%B4%D9%88%D8%AF).mp4",
      video_07_nicaea: "/video-bg/VIDEO%2007%20%E2%80%94%20%D9%85%D8%AC%D9%85%D8%B9%20%D9%86%D9%8A%D9%82%D9%8A%D8%A9%20(%D8%A7%D9%84%D8%A5%D9%85%D8%A8%D8%B1%D8%A7%D8%B7%D9%88%D8%B1%20%D9%88%D8%A7%D9%84%D8%AD%D9%83%D9%8A%D9%85).mp4",
      video_08_andalusia: "/video-bg/VIDEO%2008%20%E2%80%94%20%D8%A7%D9%84%D8%A3%D9%86%D8%AF%D9%84%D8%B3%20(%D8%AC%D9%85%D8%A7%D9%84%20%D9%8A%D8%AA%D9%84%D8%A7%D8%B4%D9%89).mp4",
      video_09_abu_abdullah_tears: "/video-bg/VIDEO%2009%20%E2%80%94%20%D8%AF%D9%85%D9%88%D8%B9%20%D8%A3%D8%A8%D9%88%20%D8%B9%D8%A8%D8%AF%20%D8%A7%D9%84%D9%84%D9%87%20(%D8%B2%D9%81%D8%B1%D8%A9%20%D8%A7%D9%84%D8%B9%D8%B1%D8%A8%D9%8A%20%D8%A7%D9%84%D8%A3%D8%AE%D9%8A%D8%B1%D8%A9).mp4",
      video_10_berlin_1933: "/video-bg/VIDEO%2010%20%E2%80%94%20%D8%A8%D8%B1%D9%84%D9%8A%D9%86%201933%20(%D8%A7%D9%84%D9%83%D8%A8%D8%B1%20%D9%8A%D8%B5%D8%A8%D8%AD%20%D9%86%D8%B8%D8%A7%D9%85%D8%A7%D9%8B).mp4",
      video_11_karbala: "/video-bg/VIDEO%2011%20%E2%80%94%20%D9%83%D8%B1%D8%A8%D9%84%D8%A7%D8%A1%20(%D8%A7%D9%84%D8%AD%D9%82%20%D8%A7%D9%84%D8%A3%D8%B9%D8%B2%D9%84).mp4",
      video_12_digital_space: "/video-bg/VIDEO%2012%20%E2%80%94%20%D8%A7%D9%84%D9%81%D8%B6%D8%A7%D8%A1%20%D8%A7%D9%84%D8%B1%D9%82%D9%85%D9%8A%20(%D8%A7%D9%84%D9%85%D9%88%D8%A7%D8%AC%D9%87%D8%A9%20%D9%85%D8%B9%20%D8%A7%D9%84%D9%85%D9%87%D9%86%D8%AF%D8%B3).mp4",
      video_13_enter_key: "/video-bg/VIDEO%2013%20%E2%80%94%20%D8%B6%D8%BA%D8%B7%D8%A9%20Enter%20(%D8%A7%D9%84%D8%AA%D8%B6%D8%AD%D9%8A%D8%A9%20%D8%A7%D9%84%D9%86%D9%87%D8%A7%D8%A6%D9%8A%D8%A9).mp4",
      generated_andalus: "/generated-assets/video-bg/andalus.mp4",
      generated_desert: "/generated-assets/video-bg/desert.mp4",
      generated_karblaa: "/generated-assets/video-bg/karblaa.mp4",
      generated_yehya_office: "/generated-assets/video-bg/yehya-office-vid.mp4",
    },
    image: {
      generated_01: "/generated-assets/images/01.jpg",
      generated_02: "/generated-assets/images/02.jpg",
      generated_03: "/generated-assets/images/03.jpg",
      generated_04: "/generated-assets/images/04.jpg",
      generated_05: "/generated-assets/images/05.jpg",
      generated_06: "/generated-assets/images/06.jpg",
      generated_07: "/generated-assets/images/07.jpg",
      guide_scene_1_1: "IMAGES-FROM-GUIDE/bg_scene_1.1.png",
      logo_01: "client/src/LOGO/new-logo/new-logo-trans-osiris@10x.png",
      logo_02: "client/src/LOGO/new-logo/new-logo-trans-osiris@10x.png",
      logo_03: "client/src/LOGO/new-logo/new-logo-trans-osiris@10x.png",
      logo_04: "client/src/LOGO/new-logo/new-logo-trans-osiris@10x.png",
      logo_05: "client/src/LOGO/new-logo/favicon-black-0.25.png",
      logo_06: "client/src/LOGO/new-logo/favicon-bloack.png",
    },
    characters: {
      arius: "/generated-assets/characters/آريوس.jpeg",
      athanasius: "/generated-assets/characters/أثناسيوس.jpeg",
      narrator: "/generated-assets/characters/الراوي الكوني-التجسيد البصري (Visual Representation).png",
      samiri_calf: "/generated-assets/characters/السامري-اصورة صناعة العجل (The Golden Calf Scene).png",
      samiri: "/generated-assets/characters/السامري-الصورة الأساسية (Portrait).jpeg",
      first_engineer: "/generated-assets/characters/المهندس الأول-الصورة الأساسية (Portrait).jpeg",
      first_engineer_2: "/generated-assets/characters/المهندس الأول-الصورة الأساسية (Portrait)02.jpeg",
      first_engineer_exposed: "/generated-assets/characters/المهندس الأول-صورة الانكشاف (Exposed — Final Scene).jpeg",
      first_engineer_confront: "/generated-assets/characters/المهندس الأول-صورة المواجهة (Confrontation).jpeg",
      tarek: "/generated-assets/characters/طارق الراشد-الصورة الأساسية (Portrait).jpeg",
      tarek_ghost: "/generated-assets/characters/طارق الراشد-صورة التسجيل (Recording — Ghost Image).jpeg",
      tarek_dream: "/generated-assets/characters/طارق الراشد-صورة الحلم (Dream Sequence).jpeg",
      constantine: "/generated-assets/characters/قسطنطين-الصورة الأساسية (Portrait).jpeg",
      laila_faith: "/generated-assets/characters/ليلى حسن-صورة الإيمان (Faith Portrait).jpeg",
      laila_witness: "/generated-assets/characters/ليلى حسن-صورة الشاهدة (Witness Scene — Final Chapter).jpeg",
      laila: "/generated-assets/characters/ليلى حسنالصورة الأساسية (Portrait).jpeg",
      yahya: "/generated-assets/characters/يحيى الراشد-الصورة الأساسية (Portrait).jpeg",
      yahya_breakdown: "/generated-assets/characters/يحيى الراشد-صورة الانهيار (Breakdown Scene).jpeg",
      yahya_confront: "/generated-assets/characters/يحيى الراشد-صورة المواجهة (Confrontation Scene).jpeg",
    },
    project: {
      devil_voice_aup3: "MUSIC-BG/devil-voice-to-clone.aup3",
      prompts_spec: "OSIRIS_ASSET_PROMPTS.md",
    },
  },
} as const;

export type AssetUrls = typeof RAW_ASSET_URLS;

export const ASSET_URLS = createAssetProxy(RAW_ASSET_URLS) as AssetUrls;

export interface ProjectMediaEntry {
  key: string;
  kind: "audio" | "video" | "image" | "project";
  value: string;
}

export function getProjectMediaEntries(): ProjectMediaEntry[] {
  const groups = ASSET_URLS.projectMedia;
  const entries: ProjectMediaEntry[] = [];
  (Object.entries(groups.audio) as Array<[string, string]>).forEach(([key, value]) => {
    entries.push({ key, kind: "audio", value });
  });
  (Object.entries(groups.video) as Array<[string, string]>).forEach(([key, value]) => {
    entries.push({ key, kind: "video", value });
  });
  (Object.entries(groups.image) as Array<[string, string]>).forEach(([key, value]) => {
    entries.push({ key, kind: "image", value });
  });
  (Object.entries(groups.project) as Array<[string, string]>).forEach(([key, value]) => {
    entries.push({ key, kind: "project", value });
  });
  return entries;
}
