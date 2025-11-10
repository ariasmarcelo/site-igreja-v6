import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Heart, Sun, Users, BookOpen, Brain, Ghost, Database, Compass, HeartCrack, User, Sparkles, ArrowLeftRight, UserRound, Zap } from 'lucide-react';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import { useLocaleTexts } from '@/hooks/useLocaleTexts';
import { usePageStyles } from '@/hooks/usePageStyles';
import PageLoader from '@/components/PageLoader';
import fallbackTexts from '@/locales/pt-BR/Index.json';

type IndexTexts = typeof fallbackTexts;

export default function Index() {
  usePageStyles('index');
  const { texts, loading, error } = useLocaleTexts<IndexTexts>('index', fallbackTexts);
  
  const benefitsIcons = [
    <Sun className="w-12 h-12 text-pink-600 mb-4" key="s" />,
    <Users className="w-12 h-12 text-[#5EA98D] mb-4" key="u" />,
    <BookOpen className="w-12 h-12 text-[#4A90A9] mb-4" key="b" />
  ];

  return (
    <PageLoader loading={loading} error={error}>
      {!texts ? null : (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-linear-to-br from-[#FAF9F7] via-[#F5F3F0] to-[#E8E6E3]">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#CFAF5A] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#4A90A9] rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center fade-in">
            {/* Sol Dourado Animado */}
            <div className="flex justify-center mb-8 -mt-12">
              <div className="relative w-32 h-32">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full animate-spin-slow"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="50" cy="50" r="20" fill="#CFAF5A" />
                  {[...Array(12)].map((_, i) => {
                    const angle = (i * 30 * Math.PI) / 180;
                    const x1 = 50 + Math.cos(angle) * 25;
                    const y1 = 50 + Math.sin(angle) * 25;
                    const x2 = 50 + Math.cos(angle) * 40;
                    const y2 = 50 + Math.sin(angle) * 40;
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#CFAF5A"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    );
                  })}
                </svg>
              </div>
            </div>

            <h1 
              className="text-5xl md:text-7xl font-bold mb-6 text-[#222222] leading-tight" data-json-key="index.hero.title">
              {texts.hero.title}
            </h1>
            <p 
              className="text-2xl md:text-3xl mb-16 text-[#CFAF5A] font-semibold" data-json-key="index.hero.subtitle">
              {texts.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/purificacao">
                <Button className="btn-gold text-lg px-8 py-6">
                  <span data-json-key="index.hero.buttons.purification">{texts.hero.buttons.purification}</span>
                </Button>
              </Link>
              <Link to="/tratamentos">
                <Button className="btn-silver text-lg px-8 py-6">
                  <span data-json-key="index.hero.buttons.treatments">{texts.hero.buttons.treatments}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

            {/* Igreja de Metatron Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="fade-in">
                <div className="flex items-center gap-4 mb-6">
                  {/* Sol branco - código exato da página Purificação */}
                  <svg
                    viewBox="0 0 100 100"
                    className="w-12 h-12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    data-icon-name="Sol Branco - Igreja"
                    data-icon-type="section-icon"
                  >
                    <circle cx="50" cy="50" r="20" fill="white" />
                    {[...Array(12)].map((_, i) => {
                      const angle = (i * 30 * Math.PI) / 180;
                      const x1 = 50 + Math.cos(angle) * 25;
                      const y1 = 50 + Math.sin(angle) * 25;
                      const x2 = 50 + Math.cos(angle) * 40;
                      const y2 = 50 + Math.sin(angle) * 40;
                      return (
                        <line
                          key={i}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      );
                    })}
                  </svg>
                  <h2 
                    className="text-4xl md:text-5xl font-bold text-[#222222]" data-json-key="index.igreja.title">
                    {texts.igreja.title}
                  </h2>
                </div>
                {texts.igreja.description.map((paragraph, index) => (
                  <p 
                    key={index} 
                    className="text-lg text-gray-700 mb-6 leading-relaxed"
                    data-json-key={`index.igreja.description[${index}]`}
                  >
                    {paragraph}
                  </p>
                ))}
                <Link to="/quem-somos">
                  <Button 
                    className="btn-gold" data-json-key="index.igreja.knowMoreButton">
                    {texts.igreja.knowMoreButton}
                  </Button>
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-[#CFAF5A] to-[#B38938] rounded-3xl transform rotate-3"></div>
                <Card className="relative bg-white shadow-2xl rounded-3xl overflow-hidden">
                  <CardHeader className="bg-linear-to-r from-[#CFAF5A] to-[#B38938] text-white p-8">
                    <CardTitle 
                      className="text-2xl" data-json-key="index.purification.title">
                      {texts.purification.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      {texts.purification.phases.map((phase, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div 
                            className="w-8 h-8 rounded-full bg-[#CFAF5A] bg-opacity-20 flex items-center justify-center shrink-0 mt-1"
                            data-json-key={`index.purification.phases[${index}].number`}
                          >
                            <span className="text-[#CFAF5A] font-bold">{index + 1}</span>
                          </div>
                          <div>
                            <h4 
                              className="font-semibold text-lg mb-1"
                              data-json-key={`index.purification.phases[${index}].title`}
                            >
                              {phase.title}
                            </h4>
                            <p 
                              className="text-gray-600"
                              data-json-key={`index.purification.phases[${index}].description`}
                            >
                              {phase.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instituto Metatron Section */}
      <section className="py-16 bg-linear-to-br from-[#F5F3F0] to-[#E8E6E3]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 relative">
                <div className="absolute inset-0 bg-linear-to-br from-[#4A90A9] to-[#3a7089] rounded-3xl transform -rotate-3"></div>
                <Card className="relative bg-white shadow-2xl rounded-3xl overflow-hidden">
                  <CardHeader className="bg-linear-to-r from-[#4A90A9] to-[#5EA98D] text-white p-8">
                    <CardTitle 
                      className="text-2xl" data-json-key="index.instituto.title">
                      {texts.instituto.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                      <div className="space-y-3">
                        {texts.instituto.description.map((paragraph: string, idx: number) => (
                          <p 
                            key={idx} 
                            className="text-lg text-gray-700 mb-6 leading-relaxed"
                            data-json-key={`index.instituto.description[${idx}]`}
                          >
                            {paragraph}
                          </p>
                        ))}
                        <div className="space-y-3">
                          {texts.instituto.treatments.map((treatment: string, index: number) => (
                            <div key={index} className="flex items-center gap-3">
                              <Heart 
                                className="w-5 h-5 text-[#5EA98D] shrink-0"
                                data-json-key={`index.instituto.treatments_icon[${index}]`}
                              />
                              <span 
                                className="text-gray-700"
                                data-json-key={`index.instituto.treatments[${index}]`}
                              >
                                {treatment}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                </Card>
              </div>
              <div className="order-1 md:order-2 fade-in">
                <div className="flex items-center gap-4 mb-6">
                  {/* Sol branco - código exato da página Purificação */}
                  <svg
                    viewBox="0 0 100 100"
                    className="w-12 h-12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    data-icon-name="Sol Branco - Instituto"
                    data-icon-type="section-icon"
                  >
                    <circle cx="50" cy="50" r="20" fill="white" />
                    {[...Array(12)].map((_, i) => {
                      const angle = (i * 30 * Math.PI) / 180;
                      const x1 = 50 + Math.cos(angle) * 25;
                      const y1 = 50 + Math.sin(angle) * 25;
                      const x2 = 50 + Math.cos(angle) * 40;
                      const y2 = 50 + Math.sin(angle) * 40;
                      return (
                        <line
                          key={i}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      );
                    })}
                  </svg>
                  <h2 
                    className="text-4xl md:text-5xl font-bold text-[#222222]" data-json-key="index.instituto.title">
                    {texts.instituto.title}
                  </h2>
                </div>
                {texts.instituto.description.map((paragraph: string, idx: number) => (
                  <p 
                    key={idx} 
                    className="text-lg text-gray-700 mb-6 leading-relaxed"
                    data-json-key={`index.instituto.description[${idx}]`}
                  >
                    {paragraph}
                  </p>
                ))}

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
                  <p 
                    className="text-sm text-amber-800" data-json-key="index.instituto.legalNotice">
                    <strong>Aviso Legal:</strong> {texts.instituto.legalNotice}
                  </p>
                </div>

                <Link 
                  to="/tratamentos"
                >
                  <Button 
                    className="bg-linear-to-r from-[#4A90A9] to-[#5EA98D] text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" data-json-key="index.instituto.ctaButton">
                    {texts.instituto.ctaButton}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-[#222222]" data-json-key="index.benefitsSection.title">
              {texts.benefitsSection.title}
            </h2>
            <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto" data-json-key="index.benefitsSection.subtitle">
              {texts.benefitsSection.subtitle}
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {texts.instituto.benefits.map((b: { title: string; description: string }, i: number) => (
                <Card className="card-hover border-2 border-gray-100" key={i}>
                  <CardHeader className="text-center">
                    {i === 0 ? (
                      <div className="flex gap-3 mb-4 justify-center">
                        <Sun className="w-12 h-12 text-pink-600" />
                        <UserRound className="w-12 h-12 text-pink-600" />
                        <Sun className="w-12 h-12 text-pink-600" />
                      </div>
                    ) : i === 1 ? (
                      <div className="flex gap-3 mb-4 justify-center">
                        <Users className="w-12 h-12 text-[#5EA98D]" />
                        <ArrowLeftRight className="w-12 h-12 text-[#5EA98D]" />
                        <Users className="w-12 h-12 text-[#5EA98D]" />
                      </div>
                    ) : i === 2 ? (
                      <div className="flex gap-3 mb-4 justify-center">
                        <Brain className="w-12 h-12 text-[#4A90A9]" />
                        <Heart className="w-12 h-12 text-[#4A90A9]" />
                        <Sparkles className="w-12 h-12 text-[#4A90A9]" />
                      </div>
                    ) : (
                      benefitsIcons[i]
                    )}
                    <CardTitle className="text-2xl" data-json-key={`index.instituto.benefits[${i}].title`}>{b.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-base text-gray-700" data-json-key={`index.instituto.benefits[${i}].description`}>{b.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nova Seção: O que é Físico e o que é Espiritual */}
      <section className="py-16 px-4 bg-linear-to-br from-[#FAF9F7] to-[#F5F3F0]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="relative inline-block mb-6 sm:mb-8">
              <div className="absolute inset-0 bg-purple-400/30 blur-2xl rounded-full animate-pulse" />
              <Sun className="w-16 h-16 sm:w-24 sm:h-24 text-amber-500 relative mx-auto" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 bg-linear-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent px-4" data-json-key="index.fisicoEspiritual.title">
              {texts.fisicoEspiritual.title}
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed px-4" data-json-key="index.fisicoEspiritual.subtitle">
              {texts.fisicoEspiritual.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-10 mb-12 sm:mb-16">
            {/* Escopo do Instituto - Físico/Científico */}
            <Card className="border-blue-300 shadow-xl hover:shadow-2xl transition-all">
              <CardContent className="pt-8 sm:pt-10 pb-8 sm:pb-10 px-6 sm:px-8">
                <div className="text-center mb-6 sm:mb-8">
                  <Brain className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500 mx-auto mb-4 sm:mb-5" />
                  <h3 className="text-xl sm:text-2xl font-bold text-blue-700 mb-2 sm:mb-3" data-json-key="index.fisicoEspiritual.fisico.title">{texts.fisicoEspiritual.fisico.title}</h3>
                  <p className="text-base sm:text-lg text-blue-600 font-semibold" data-json-key="index.fisicoEspiritual.fisico.subtitle">{texts.fisicoEspiritual.fisico.subtitle}</p>
                </div>
                
                <div className="space-y-4 sm:space-y-6 text-gray-700">
                  <p className="leading-relaxed text-sm sm:text-base" data-json-key="index.fisicoEspiritual.fisico.description">
                    {texts.fisicoEspiritual.fisico.description}
                  </p>
                  
                  <ul className="space-y-2 sm:space-y-3 ml-2">
                    {texts.fisicoEspiritual.fisico.items.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 sm:gap-3">
                        <span className="text-blue-500 mt-1 text-base sm:text-lg shrink-0">•</span>
                        <span className="text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </li>
                    ))}
                  </ul>

                  <div className="bg-blue-50 p-4 sm:p-5 rounded-lg border border-blue-200 mt-4 sm:mt-6">
                    <p className="text-xs sm:text-sm font-semibold text-blue-800 mb-2 sm:mb-3" data-json-key="index.fisicoEspiritual.fisico.abordagem.title">{texts.fisicoEspiritual.fisico.abordagem.title}</p>
                    <p className="text-xs sm:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: texts.fisicoEspiritual.fisico.abordagem.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}  data-json-key="index.fisicoEspiritual.fisico.abordagem.description"/>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Escopo da Igreja - Espiritual/Energético */}
            <Card className="border-amber-300 shadow-xl hover:shadow-2xl transition-all">
              <CardContent className="pt-8 sm:pt-10 pb-8 sm:pb-10 px-6 sm:px-8">
                <div className="text-center mb-6 sm:mb-8">
                  <Ghost className="w-12 h-12 sm:w-16 sm:h-16 text-amber-500 mx-auto mb-4 sm:mb-5" />
                  <h3 className="text-xl sm:text-2xl font-bold text-amber-700 mb-2 sm:mb-3" data-json-key="index.fisicoEspiritual.espiritual.title">{texts.fisicoEspiritual.espiritual.title}</h3>
                  <p className="text-base sm:text-lg text-amber-600 font-semibold" data-json-key="index.fisicoEspiritual.espiritual.subtitle">{texts.fisicoEspiritual.espiritual.subtitle}</p>
                </div>
                
                <div className="space-y-4 sm:space-y-6 text-gray-700">
                  <p className="leading-relaxed text-sm sm:text-base" data-json-key="index.fisicoEspiritual.espiritual.description">
                    {texts.fisicoEspiritual.espiritual.description}
                  </p>
                  
                  <ul className="space-y-2 sm:space-y-3 ml-2">
                    {texts.fisicoEspiritual.espiritual.items.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 sm:gap-3">
                        <span className="text-amber-500 mt-1 text-base sm:text-lg shrink-0">•</span>
                        <span className="text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </li>
                    ))}
                  </ul>

                  <div className="bg-amber-50 p-4 sm:p-5 rounded-lg border border-amber-200 mt-4 sm:mt-6">
                    <p className="text-xs sm:text-sm font-semibold text-amber-800 mb-2 sm:mb-3" data-json-key="index.fisicoEspiritual.espiritual.abordagem.title">{texts.fisicoEspiritual.espiritual.abordagem.title}</p>
                    <p className="text-xs sm:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: texts.fisicoEspiritual.espiritual.abordagem.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}  data-json-key="index.fisicoEspiritual.espiritual.abordagem.description"/>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Abordagem Integrada */}
          <Card className="border-purple-300 shadow-2xl bg-linear-to-br from-purple-50/50 via-amber-50/50 to-blue-50/50 -mt-6 sm:-mt-10">
            <CardContent className="pt-8 sm:pt-10 pb-8 sm:pb-10 px-6 sm:px-10">
              <div className="text-center mb-6 sm:mb-8">
                <div className="flex justify-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <Brain className="w-10 h-10 sm:w-14 sm:h-14 text-blue-500" />
                  <Zap className="w-10 h-10 sm:w-14 sm:h-14 text-purple-500" />
                  <Sun className="w-10 h-10 sm:w-14 sm:h-14 text-amber-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-purple-700 mb-3 sm:mb-4 px-4" data-json-key="index.fisicoEspiritual.integrada.title">{texts.fisicoEspiritual.integrada.title}</h3>
              </div>
              
              <div className="space-y-4 sm:space-y-6 text-gray-700 max-w-4xl mx-auto" data-json-key="index.fisicoEspiritual.integrada.description">
                <p className="leading-relaxed text-center text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: texts.fisicoEspiritual.integrada.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}  data-json-key="index.fisicoEspiritual.integrada.description"/>
                
                <div className="bg-linear-to-r from-blue-50 via-purple-50 to-amber-50 p-6 sm:p-8 rounded-lg border-2 border-purple-300 mt-6 sm:mt-8">
                  <p className="font-semibold text-purple-900 mb-4 sm:mb-5 text-center text-sm sm:text-base" data-json-key="index.fisicoEspiritual.integrada.oferecemos.title">{texts.fisicoEspiritual.integrada.oferecemos.title}</p>
                  <ul className="space-y-3 sm:space-y-4">
                    {texts.fisicoEspiritual.integrada.oferecemos.items.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 sm:gap-4">
                        <Database className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-center font-semibold text-purple-700 mt-6 sm:mt-8 text-sm sm:text-base" data-json-key="index.fisicoEspiritual.integrada.conclusao">
                  {texts.fisicoEspiritual.integrada.conclusao}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tripla Proteção Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-800 px-4" data-json-key="index.triplaProtecao.title">
              {texts.triplaProtecao.title}
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed px-4" data-json-key="index.triplaProtecao.subtitle">
              {texts.triplaProtecao.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-10">
            {texts.triplaProtecao.items.map((item: { title: string; description: string }, idx: number) => {
              const icons = [Compass, Heart, Sun];
              const colors = ['blue', 'pink', 'amber'];
              const Icon = icons[idx];
              const color = colors[idx];
              
              return (
                <Card key={idx} className={`border-${color}-300 shadow-xl hover:shadow-2xl transition-all bg-linear-to-br from-${color}-50/50 to-white`}>
                  <CardContent className="pt-8 sm:pt-10 pb-8 sm:pb-10 px-6 sm:px-8">
                    <div className="text-center mb-6 sm:mb-8">
                      <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full ${idx === 1 ? 'bg-pink-100 relative' : `bg-${color}-100`} flex items-center justify-center mx-auto mb-4 sm:mb-6`}>
                        {idx === 1 ? (
                          <>
                            <div className="absolute inset-0 rounded-full bg-pink-300/40 blur-xl animate-pulse-subtle"></div>
                            <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-pink-600 fill-pink-600 animate-pulse-subtle relative" />
                          </>
                        ) : idx === 2 ? (
                          <Icon className={`w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] text-${color}-600 animate-spin-slow`} />
                        ) : idx === 0 ? (
                          <Icon className={`w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] text-${color}-600`} />
                        ) : (
                          <Icon className={`w-10 h-10 sm:w-12 sm:h-12 text-${color}-600`} />
                        )}
                      </div>
                      <h3 className={`text-xl sm:text-2xl font-bold text-${color}-700 mb-3 sm:mb-4`}>{item.title}</h3>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed text-center text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: item.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <TestimonialsCarousel />

      {/* CTA Final Section + Footer Combined */}
      <section className="relative overflow-hidden bg-slate-900">
        {/* Horizonte terrestre: céu acima, terra abaixo */}
        <div className="absolute inset-0 opacity-50">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 400">
            <defs>
              {/* Gradiente do céu - AZUL vibrante */}
              <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9"/>
                <stop offset="50%" stopColor="#38bdf8"/>
                <stop offset="100%" stopColor="#7dd3fc"/>
              </linearGradient>
              
              {/* Gradiente para raios de sol */}
              <linearGradient id="sunRay1" x1="20%" y1="0%" x2="20%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#fef3c7" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="sunRay2" x1="35%" y1="0%" x2="35%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#fef3c7" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="sunRay3" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#fef3c7" stopOpacity="0"/>
              </linearGradient>
              
              {/* Gradiente da terra - marrom escuro */}
              <linearGradient id="earthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#78716c"/>
                <stop offset="100%" stopColor="#44403c"/>
              </linearGradient>
            </defs>
            
            {/* CÉU AZUL - com curvatura positiva na parte inferior */}
            <path 
              d="M0,0 L1200,0 L1200,260 Q600,180 0,260 Z" 
              fill="url(#skyGradient)"
            />
            
            {/* Efeitos metálicos difusos distribuídos pelo céu */}
            <defs>
              <radialGradient id="glow1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#fef3c7" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="glow2">
                <stop offset="0%" stopColor="#fde68a" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="glow3">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#fef3c7" stopOpacity="0"/>
              </radialGradient>
            </defs>
            
            {/* Círculos de luz metálica difusa espalhados */}
            <circle cx="150" cy="30" r="80" fill="url(#glow1)" opacity="0.4"/>
            <circle cx="280" cy="50" r="60" fill="url(#glow3)" opacity="0.35"/>
            <circle cx="420" cy="25" r="90" fill="url(#glow2)" opacity="0.45"/>
            <circle cx="550" cy="45" r="70" fill="url(#glow1)" opacity="0.4"/>
            <circle cx="680" cy="35" r="85" fill="url(#glow3)" opacity="0.38"/>
            <circle cx="820" cy="55" r="65" fill="url(#glow2)" opacity="0.42"/>
            <circle cx="950" cy="40" r="75" fill="url(#glow1)" opacity="0.37"/>
            <circle cx="1080" cy="30" r="70" fill="url(#glow3)" opacity="0.4"/>
            
            {/* Segunda camada de brilhos menores */}
            <circle cx="200" cy="70" r="50" fill="url(#glow2)" opacity="0.3"/>
            <circle cx="360" cy="80" r="45" fill="url(#glow1)" opacity="0.28"/>
            <circle cx="500" cy="90" r="55" fill="url(#glow3)" opacity="0.32"/>
            <circle cx="640" cy="75" r="48" fill="url(#glow2)" opacity="0.3"/>
            <circle cx="780" cy="85" r="52" fill="url(#glow1)" opacity="0.29"/>
            <circle cx="920" cy="95" r="47" fill="url(#glow3)" opacity="0.31"/>
            <circle cx="1060" cy="80" r="50" fill="url(#glow2)" opacity="0.28"/>
            
            {/* Terceira camada - brilhos muito sutis */}
            <circle cx="100" cy="60" r="35" fill="url(#glow3)" opacity="0.25"/>
            <circle cx="320" cy="110" r="40" fill="url(#glow1)" opacity="0.22"/>
            <circle cx="480" cy="65" r="38" fill="url(#glow2)" opacity="0.24"/>
            <circle cx="720" cy="105" r="42" fill="url(#glow3)" opacity="0.23"/>
            <circle cx="880" cy="70" r="36" fill="url(#glow1)" opacity="0.25"/>
            <circle cx="1020" cy="100" r="39" fill="url(#glow2)" opacity="0.22"/>
            
            {/* TERRA - com curvatura positiva na parte superior */}
            <path 
              d="M0,260 Q600,180 1200,260 L1200,400 L0,400 Z" 
              fill="url(#earthGradient)"
            />
            
            {/* LINHA DO HORIZONTE - curvatura mais pronunciada */}
            <path 
              d="M0,260 Q600,180 1200,260" 
              stroke="#d6d3d1" 
              strokeWidth="2" 
              fill="none" 
              opacity="0.6"
            />
            
            {/* ÁGUA - camadas animadas verde-água com curvatura acentuada */}
            <path 
              className="animate-[wave_3s_ease-in-out_infinite]" 
              d="M0,340 Q600,280 1200,340 L1200,400 L0,400 Z" 
              fill="#2dd4bf" 
              opacity="0.4"
            />
            <path 
              className="animate-[wave_3s_ease-in-out_infinite_0.5s]" 
              d="M0,360 Q600,300 1200,360 L1200,400 L0,400 Z" 
              fill="#14b8a6" 
              opacity="0.35"
            />
            <path 
              className="animate-[wave_3s_ease-in-out_infinite_1s]" 
              d="M0,380 Q600,320 1200,380 L1200,400 L0,400 Z" 
              fill="#0d9488" 
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Sol Dourado - posicionado absolutamente, independente do fundo */}
        <div className="absolute top-8 left-8 w-32 h-32 z-10">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="20" fill="#CFAF5A" />
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x1 = 50 + Math.cos(angle) * 25;
              const y1 = 50 + Math.sin(angle) * 25;
              const x2 = 50 + Math.cos(angle) * 40;
              const y2 = 50 + Math.sin(angle) * 40;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#CFAF5A"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        </div>

        {/* Lua Crescente - posicionada no canto superior direito */}
        <div className="absolute top-8 right-8 w-32 h-32 z-20">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <mask id="crescentMask">
                <circle cx="50" cy="50" r="25" fill="white" />
                <circle cx="58" cy="50" r="22" fill="black" />
              </mask>
            </defs>
            <circle cx="50" cy="50" r="25" fill="#F3F4F6" mask="url(#crescentMask)" />
          </svg>
        </div>

        {/* CTA Content - posicionado no céu */}
        <div className="container mx-auto px-4 relative z-10 pt-12 pb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg" data-json-key="index.cta.title">
              {texts.cta.title}
            </h2>
            <p className="text-xl mb-8 text-white drop-shadow-md" data-json-key="index.cta.subtitle">
              {texts.cta.subtitle}
            </p>
            <Link to="/contato">
              <Button className="bg-[#CFAF5A] text-white font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" data-json-key="index.cta.buttonText">
                {texts.cta.buttonText}
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer Content - Copyright */}
        <div className="relative z-10 pt-8 pb-4 text-white">
          <div className="container mx-auto px-4">
            <div className="border-t border-emerald-700/50 mt-32 pt-4 pb-1 text-center text-emerald-100/70 text-sm max-w-4xl mx-auto">
              <p data-json-key="index.footer.copyright">{texts.footer.copyright}</p>
              <p className="mt-2" data-json-key="index.footer.trademark">{texts.footer.trademark}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
      )}
    </PageLoader>
  );
}
