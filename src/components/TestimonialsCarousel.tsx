import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Heart, Star } from 'lucide-react';
import { usePageContent } from '@/hooks/useContent';
import '@/styles/components/testimonials-carousel.css';

interface TestemunhosTexts {
  header?: { title: string };
  testimonials: Array<{
    name: string;
    role: string;
    text: string;
    rating: number;
  }>;
}

export default function TestimonialsCarousel() {
  const { data: texts, loading } = usePageContent<any>('index');

  if (loading) {
    return (
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CFAF5A] mx-auto mb-4"></div>
            <p className="text-stone-600">Carregando testemunhos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!texts?.__shared__?.testimonials) {
    console.warn('[TestimonialsCarousel] No testimonials data loaded');
    return null;
  }

  // Pegar apenas os primeiros 5 testemunhos para o carrossel
  const testimonials = texts.__shared__.testimonials.slice(0, 5);
  const headerTitle = texts.__shared__?.testimonialsSection?.title || 'Testemunhos de Transformação';

  return (
    <section className="py-12 bg-pink-400 relative overflow-visible">
      {/* Efeitos de luz dourado metálico */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-[10%] w-96 h-96 bg-yellow-300/60 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-[15%] w-[500px] h-[500px] bg-amber-400/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-[20%] w-[400px] h-[400px] bg-yellow-400/55 rounded-full blur-3xl animate-pulse" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Cabeçalho */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-white/40 backdrop-blur-xl flex items-center justify-center shadow-2xl shadow-white/20">
                <Heart className="h-10 w-10 text-yellow-400/60 fill-red-500 stroke-[2.5]" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" data-json-key="__shared__.testimonialsCarousel.title">
              {texts.__shared__?.testimonialsCarousel?.title || 'Testemunhos de Transformação'}
            </h2>
            <p className="text-xl text-white/95 opacity-90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] max-w-2xl mx-auto mb-4" data-json-key="__shared__.testimonialsCarousel.subtitle">
              {texts.__shared__?.testimonialsCarousel?.subtitle || 'Histórias reais de cura, crescimento e despertar espiritual'}
            </p>
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>

          {/* Carrossel */}
          <div className="relative mt-8">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full mb-6"
            >
              <CarouselContent className="-ml-4">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="relative pt-4 pb-2 px-2">
                      {/* Ícone Star decorativo - FORA do card */}
                      <div className="absolute top-0 left-1 w-10 h-10 bg-linear-to-br from-rose-400 to-pink-400 rounded-full flex items-center justify-center shadow-2xl z-30 border-2 border-white">
                        <Star className="w-5 h-5 text-white fill-amber-400/70" />
                      </div>
                      
                      <Card className="h-full bg-linear-to-br from-white/90 via-rose-50/80 to-pink-50/70 border-2 border-rose-200/50 hover:border-rose-300/70 shadow-xl hover:shadow-2xl hover:shadow-rose-300/40 transition-all duration-500 backdrop-blur-md">
                        <CardContent className="p-6 flex flex-col h-full">
                          {/* Conteúdo do testemunho */}
                          <div className="mb-4 grow">
                            <p className="text-rose-950/80 leading-relaxed text-base" data-json-key={`__shared__.testimonials[${index}].content`}>
                              {testimonial.content.substring(0, 200)}...
                            </p>
                          </div>
                          
                          {/* Separador decorativo */}
                          <div className="flex items-center gap-2 mb-4">
                            <div className="h-px grow bg-rose-300/40"></div>
                            <Star className="w-3 h-3 fill-amber-400/70 text-rose-600" />
                            <div className="h-px grow bg-rose-300/40"></div>
                          </div>
                          
                          {/* Informações do autor */}
                          <div className="mt-auto">
                            <p className="font-semibold text-rose-900 text-lg mb-1" data-json-key={`__shared__.testimonials[${index}].name`}>{testimonial.name}</p>
                            <p className="text-sm text-rose-700/70" data-json-key={`__shared__.testimonials[${index}].date`}>{testimonial.date}</p>
                            {testimonial.verified && (
                              <div className="inline-flex items-center gap-1 bg-green-100 px-3 py-1.5 rounded-full border border-green-200">
                                <Star className="w-3 h-3 fill-green-600 text-green-600" />
                                <span className="text-xs text-green-700 font-medium">
                                  Verificado
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-16 bg-white/90 hover:bg-rose-50 border-2 border-rose-300/60 text-rose-900 w-12 h-12" />
              <CarouselNext className="hidden md:flex -right-16 bg-white/90 hover:bg-rose-50 border-2 border-rose-300/60 text-rose-900 w-12 h-12" />
            </Carousel>
          </div>

          {/* Botão de ação */}
          <div className="text-center mt-4">
            <a
              href="/testemunhos"
              className="inline-flex items-center gap-2 bg-white/90 hover:bg-rose-50 text-rose-900 font-semibold text-lg px-10 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-rose-200/60"
            >
              <Star className="w-5 h-5 fill-amber-600 text-amber-600" />
              Ver Todos os Testemunhos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
