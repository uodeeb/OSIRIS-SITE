import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import osirisLogo from '@/LOGO/new-logo/new-logo-trans-osiris@10x.png';

interface TechSpec {
  category: string;
  specs: { label: string; value: string; arabic: string }[];
}

interface ModelArchitecture {
  layer: string;
  description: string;
  arabic: string;
}

export default function OsirisAIModel() {
  const [, setLocation] = useLocation();
  const [uiLang, setUiLang] = useState<'en' | 'ar'>('ar');

  const techSpecs: TechSpec[] = [
    {
      category: 'Model Architecture',
      specs: [
        { label: 'Architecture Type', value: 'Transformer-based Multimodal LLM', arabic: 'نموذج لغوي متعدد الأنماط基于 التحويل' },
        { label: 'Parameters', value: '175B Parameters', arabic: '175 مليار معلمة' },
        { label: 'Context Window', value: '128K Tokens', arabic: 'نافذة سياق 128 ألف رمز' },
        { label: 'Training Data', value: 'Multilingual Corpus (Arabic, English, Historical Texts)', arabic: 'مجموعة بيانات متعددة اللغات' }
      ]
    },
    {
      category: 'Cultural Intelligence',
      specs: [
        { label: 'Historical Context', value: '6,000 Years of Human History', arabic: '6,000 سنة من التاريخ البشري' },
        { label: 'Religious Texts', value: 'Quran, Bible, Torah Analysis', arabic: 'تحليل النصوص الدينية' },
        { label: 'Philosophical Framework', value: 'Islamic Golden Age + Modern Ethics', arabic: 'العصر الذهبي الإسلامي + الأخلاق الحديثة' },
        { label: 'Narrative Understanding', value: 'Archetypal Pattern Recognition', arabic: 'التعرف على الأنماط القوسية' }
      ]
    },
    {
      category: 'Interactive Capabilities',
      specs: [
        { label: 'Scene Generation', value: 'Dynamic Narrative Construction', arabic: 'بناء سردي ديناميكي' },
        { label: 'Character Consistency', value: 'Cross-Scene Personality Maintenance', arabic: 'الحفاظ على شخصية الشخصيات' },
        { label: 'Moral Complexity', value: 'Multi-Perspective Ethical Reasoning', arabic: 'الاستدلال الأخلاقي متعدد المنظورات' },
        { label: 'Cultural Sensitivity', value: 'Context-Aware Content Generation', arabic: 'توليد محتوى حساس للسياق' }
      ]
    }
  ];

  const architecture: ModelArchitecture[] = [
    {
      layer: 'Input Processing',
      description: 'Multilingual text tokenization with cultural context embedding',
      arabic: 'معالجة الإدخال: تجزئة النصوص متعددة اللغات مع تضمين السياق الثقافي'
    },
    {
      layer: 'Cultural Attention',
      description: 'Cross-attention mechanism for historical and religious context',
      arabic: 'الانتباه الثقافي: آلية انتباه متقاطع للسياق التاريخي والديني'
    },
    {
      layer: 'Ethical Reasoning',
      description: 'Moral framework integration using Islamic Golden Age philosophy',
      arabic: 'الاستدلال الأخلاقي: دمج الإطار الأخلاقي باستخدام فلسفة العصر الذهبي الإسلامي'
    },
    {
      layer: 'Narrative Generation',
      description: 'Dynamic scene construction with character consistency',
      arabic: 'توليد السرد: بناء المشهد الديناميكي مع الحفاظ على شخصية الشخصيات'
    },
    {
      layer: 'Output Synthesis',
      description: 'Multimodal output combining text, audio, and visual elements',
      arabic: 'توليف الإخراج: إخراج متعدد الأوضاع يجمع النصوص والصوت والعناصر البصرية'
    }
  ];

  const isArabic = uiLang === 'ar';

  return (
    <div className="min-h-screen bg-black text-white" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-white/10 bg-black/80 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={osirisLogo} alt="OSIRIS" className="h-8 w-auto" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  {isArabic ? 'نموذج أوزيريس الذكي' : 'OSIRIS AI Model'}
                </h1>
                <p className="text-xs text-white/60">
                  {isArabic ? 'الذكاء الاصطناعي للسرد الثقافي' : 'Cultural Narrative Intelligence'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setUiLang(isArabic ? 'en' : 'ar')}
                className="px-3 py-1.5 text-xs rounded-md border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
              >
                {isArabic ? 'English' : 'العربية'}
              </button>
              <button
                onClick={() => setLocation('/')}
                className="px-3 py-1.5 text-xs rounded-md border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
              >
                {isArabic ? 'الرئيسية' : 'Home'}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden py-20 sm:py-32"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-6xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                {isArabic ? 'نموذج أوزيريس' : 'OSIRIS Model'}
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/80 max-w-3xl mx-auto mb-8 leading-relaxed"
            >
              {isArabic 
                ? 'نموذج ذكاء اصطناعي متقدم مصمم لفهم وتوليد السرد الثقافي عبر 6,000 سنة من التاريخ البشري، مع التركيز على الفهم العميق للسياق التاريخي والديني والأخلاقي.'
                : 'An advanced AI model designed to understand and generate cultural narrative across 6,000 years of human history, with deep focus on historical, religious, and ethical context.'
              }
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Technical Specifications */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h3 className="text-3xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {isArabic ? 'المواصفات التقنية' : 'Technical Specifications'}
            </span>
          </h3>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {techSpecs.map((spec, index) => (
              <motion.div
                key={spec.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <h4 className="text-lg font-semibold mb-4 text-yellow-400">
                  {isArabic ? 
                    (spec.category === 'Model Architecture' ? 'معمارية النموذج' :
                     spec.category === 'Cultural Intelligence' ? 'الذكاء الثقافي' :
                     'القدرات التفاعلية') : spec.category
                  }
                </h4>
                <div className="space-y-3">
                  {spec.specs.map((item, i) => (
                    <div key={i} className="flex justify-between items-start">
                      <span className="text-sm text-white/70">
                        {isArabic ? item.arabic : item.label}
                      </span>
                      <span className="text-sm font-mono text-white/90">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Architecture Diagram */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="py-16 bg-gradient-to-b from-black to-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h3 className="text-3xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {isArabic ? 'معمارية النموذج' : 'Model Architecture'}
            </span>
          </h3>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {architecture.map((layer, index) => (
                <motion.div
                  key={layer.layer}
                  initial={{ opacity: 0, x: isArabic ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-center gap-6"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-yellow-400 mb-2">
                      {isArabic ? 
                        (layer.layer === 'Input Processing' ? 'معالجة الإدخال' :
                         layer.layer === 'Cultural Attention' ? 'الانتباه الثقافي' :
                         layer.layer === 'Ethical Reasoning' ? 'الاستدلال الأخلاقي' :
                         layer.layer === 'Narrative Generation' ? 'توليد السرد' :
                         'توليف الإخراج') : layer.layer
                      }
                    </h4>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {isArabic ? layer.arabic : layer.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Key Features */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h3 className="text-3xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {isArabic ? 'المميزات الأساسية' : 'Key Features'}
            </span>
          </h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/5 p-6">
              <h4 className="text-xl font-semibold mb-3 text-yellow-400">
                {isArabic ? 'الذكاء الثقافي العميق' : 'Deep Cultural Intelligence'}
              </h4>
              <p className="text-white/80 leading-relaxed">
                {isArabic 
                  ? 'يفهم النموذج السياق التاريخي والديني والأخلاقي للنصوص، مما يسمح بتوليد سرد معقد وذو مغزى يعكس الفهم العميق للثقافة الإسلامية والعربية.'
                  : 'The model understands historical, religious, and ethical context of texts, allowing generation of complex, meaningful narrative that reflects deep understanding of Islamic and Arabic culture.'
                }
              </p>
            </div>
            
            <div className="rounded-lg border border-white/10 bg-white/5 p-6">
              <h4 className="text-xl font-semibold mb-3 text-yellow-400">
                {isArabic ? 'التفاعل المتعدد الأبعاد' : 'Multidimensional Interaction'}
              </h4>
              <p className="text-white/80 leading-relaxed">
                {isArabic 
                  ? 'يتفاعل مع المستخدمين على مستويات متعددة: اللغوية، الثقافية، الأخلاقية، والروحية، مما يخلق تجربة غامرة وشخصية.'
                  : 'Interacts with users on multiple levels: linguistic, cultural, ethical, and spiritual, creating an immersive and personal experience.'
                }
              </p>
            </div>
            
            <div className="rounded-lg border border-white/10 bg-white/5 p-6">
              <h4 className="text-xl font-semibold mb-3 text-yellow-400">
                {isArabic ? 'الحفاظ على الاتساق' : 'Consistency Preservation'}
              </h4>
              <p className="text-white/80 leading-relaxed">
                {isArabic 
                  ? 'يحافظ على اتساق الشخصيات والسرد والموضوعات الأخلاقية عبر المشاهد المختلفة، مما يضمن تجربة سردية متماسكة.'
                  : 'Maintains consistency of characters, narrative, and ethical themes across different scenes, ensuring a cohesive storytelling experience.'
                }
              </p>
            </div>
            
            <div className="rounded-lg border border-white/10 bg-white/5 p-6">
              <h4 className="text-xl font-semibold mb-3 text-yellow-400">
                {isArabic ? 'التعلم والتكيف' : 'Learning and Adaptation'}
              </h4>
              <p className="text-white/80 leading-relaxed">
                {isArabic 
                  ? 'يتعلم من تفاعلات المستخدمين ويتكيف مع تفضيلاتهم الثقافية والأخلاقية، مما يجعل كل تجربة فريدة وشخصية.'
                  : 'Learns from user interactions and adapts to their cultural and ethical preferences, making each experience unique and personal.'
                }
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm text-white/60">
            {isArabic 
              ? 'نموذج أوزيريس - دمج الذكاء الاصطناعي مع الحكمة الثقافية لخلاص تجارب سردية غامرة وذات مغزى.'
              : 'OSIRIS Model - Merging AI intelligence with cultural wisdom to create immersive, meaningful narrative experiences.'
            }
          </p>
        </div>
      </footer>
    </div>
  );
}