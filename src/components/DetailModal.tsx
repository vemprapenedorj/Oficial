import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Compass, Phone, MessageCircle, MapPin, Clock, Globe, ArrowRight, Instagram, Calendar } from 'lucide-react';
import { DetailItem, Page } from '../types';
import { trackEvent } from '../analytics/tracking';
import { pushWhatsappClick, pushInstagramClick } from '../analytics/events';

export function DetailModal({ item, onClose }: { item: DetailItem | null, onClose: () => void }) {
  if (!item) return null;

  const getWhatsAppMessage = () => {
    const isLodging = item.category === 'Hospedagem';
    const foodCategories = ['Gastronomia', 'Italiana', 'Pizzaria', 'Contemporânea', 'Churrasco', 'Carnes', 'Alemã', 'Peixes', 'Experiência', 'Choperia'];
    const isFood = foodCategories.includes(item.category);
    
    // Grammatical gender logic
    const titleLower = item.title.toLowerCase();
    const isFeminine = titleLower.includes('pousada') || 
                       titleLower.includes('casa') || 
                       titleLower.includes('pizzaria') || 
                       titleLower.includes('choperia') ||
                       titleLower.includes('cachoeira') ||
                       titleLower.includes('pequena finlândia');
    
    const article = isFeminine ? 'a' : 'o';
    const contraction = isFeminine ? 'na' : 'no';
    
    if (isLodging) {
      return `Olá, vim do portal VEM PRA PENEDO e gostaria de informações sobre reservas ${contraction} ${item.title}`;
    }
    if (isFood) {
      return `Olá! Vi ${article} ${item.title} no VEM PRA PENEDO e gostaria de ver o cardápio.`;
    }
    return `Olá! Vi ${article} ${item.title} no VEM PRA PENEDO e gostaria de mais informações.`;
  };

  const whatsappUrl = `https://wa.me/55${item.whatsapp || '24992087767'}?text=${encodeURIComponent(getWhatsAppMessage())}`;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-[2rem] overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="relative h-64 sm:h-80 bg-gray-100 flex items-center justify-center overflow-hidden">
            {/* Blurred Background Layer for Contained Images */}
            {['pequena-finlandia', 'pequena-finlandia-shopping', 'lelu-museu', 'hotel-girassol', 'hotel-bertell', 'hotel-britannia', 'hotel-daniela', 'hotel-rio-penedo', 'hotel-do-sino', 'hotel-titanic', 'pousada-aurora-mantiqueira', 'pousada-chez-nous', 'pousada-penedo', 'pousada-reserva-penedo', 'pousada-terraco', 'pousada-villa-luna', 'pousada-rainha-da-mata', 'vila-francesa-hotel', 'aglio-e-olio', 'bazzini-pizzeria', 'borbulha-penedo', 'botegare', 'braseiro-gaucho', 'casa-da-picanha', 'casa-do-fritz', 'enoteca-serrana', 'estancia-penedo', 'kaiten-sushi', 'loazo-resto', 'petit-gourmet', 'pizza-da-villa', 'querencia', 'rei-das-trutas', 'restaurante-finlandes', 'truta-viva', 'zero-a-zero', 'tonttulakki-suklaat', 'lugano-penedo', 'lolita-penedo', 'kahvila-cafe'].includes(item.id) && (
              <div 
                className="absolute inset-0 z-0 opacity-40 scale-110 blur-xl"
                style={{ 
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            )}
            <img 
              src={item.image} 
              className={`relative z-10 w-full h-full ${
                item.id === 'hotel-girassol'
                  ? 'object-contain object-center p-4'
                  : ['pequena-finlandia', 'pequena-finlandia-shopping', 'lelu-museu', 'hotel-bertell', 'hotel-britannia', 'hotel-daniela', 'hotel-rio-penedo', 'hotel-do-sino', 'hotel-titanic', 'pousada-aurora-mantiqueira', 'pousada-chez-nous', 'pousada-penedo', 'pousada-reserva-penedo', 'pousada-terraco', 'pousada-villa-luna', 'pousada-rainha-da-mata', 'vila-francesa-hotel', 'aglio-e-olio', 'bazzini-pizzeria', 'borbulha-penedo', 'botegare', 'braseiro-gaucho', 'casa-da-picanha', 'casa-do-fritz', 'enoteca-serrana', 'estancia-penedo', 'kaiten-sushi', 'loazo-resto', 'petit-gourmet', 'pizza-da-villa', 'querencia', 'rei-das-trutas', 'restaurante-finlandes', 'truta-viva', 'zero-a-zero', 'tonttulakki-suklaat', 'lugano-penedo', 'lolita-penedo', 'kahvila-cafe'].includes(item.id) 
                    ? 'object-contain object-top p-4' 
                    : 'object-cover'
              }`} 
              alt={item.title} 
              referrerPolicy="no-referrer" 
            />
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-colors"
            >
              <X size={24} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white z-20">
              <span className="inline-block px-3 py-1 rounded-full bg-penedo-gold text-[10px] font-bold uppercase tracking-wider mb-2">
                {item.category}
              </span>
              <h2 className="text-3xl font-bold">{item.title}</h2>
            </div>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              {item.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-penedo-emerald" />
                  <span>{item.location}</span>
                </div>
              )}
              {item.hours && (
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-penedo-emerald" />
                  <span>{item.hours}</span>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-4">
                {item.rating && (
                  <div className="flex items-center gap-2">
                    <Star size={18} className="text-penedo-gold fill-penedo-gold" />
                    <span className="font-bold text-penedo-graphite">{item.rating}</span>
                  </div>
                )}
                {item.tripadvisorUrl && (
                  <div className="flex items-center gap-2">
                    <a href={item.tripadvisorUrl} target="_blank" rel="noopener noreferrer" className="text-penedo-emerald hover:underline font-semibold flex items-center gap-1">
                      <span>Ver no Tripadvisor</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600 leading-relaxed text-lg">
                {item.fullInfo}
              </p>
            </div>
            
            <div className="pt-6 border-t grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a 
                href={item.link_maps || item.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.title + ' ' + (item.location || 'Penedo Itatiaia RJ'))}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('map_location', item.category, item.title)}
                className="py-4 bg-penedo-forest text-white font-bold rounded-2xl hover:bg-black transition-colors flex items-center justify-center gap-2 text-sm h-full"
              >
                <MapPin size={18} /> Como Chegar
              </a>
              {(() => {
                const isPremium = item.isPremium || (item as any).is_premium;
                const isHospedagem = item.category === 'Hospedagem';
                const fallbackBookingUrl = 'https://www.booking.com/searchresults.pt-br.html?label=pt-br-booking-desktop-9_uvqir24qvA6x6xGiDvCQS652796015463%3Apl%3Ata%3Ap1%3Ap2%3Aac%3Aap%3Aneg%3Afi%3Atikwd-65526620%3Alp1031722%3Ali%3Adec%3Adm&gclid=Cj0KCQjwxvjRBhC2ARIsAI7KJa1ZHtRerJPfgkFeXecwrxjO7CkOzHPB6Gy0PC6H1ul-Q0ltXy90nk0aAiq6EALw_wcB&aid=2311236&dest_id=900048364&dest_type=city&group_adults=2&req_adults=2&no_rooms=1&group_children=0&req_children=0&order=class';
                const bookingUrl = item.link_booking || fallbackBookingUrl;

                if (isHospedagem) {
                  if (isPremium) {
                    return (
                      <>
                        <a 
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => pushWhatsappClick({
                            business_id: item.id,
                            business_name: item.title,
                            business_category: item.category,
                            is_premium: !!(item.isPremium || item.is_premium)
                          })}
                          className="py-4 bg-[#25D366] text-white font-bold rounded-2xl hover:bg-[#128C7E] shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2 text-sm transform active:scale-95 h-full"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                          </svg> WhatsApp
                        </a>
                        <a 
                          href={item.instagram || item.link_instagram || "https://www.instagram.com/vemprapenedo/"}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => pushInstagramClick({
                            business_id: item.id,
                            business_name: item.title,
                            business_category: item.category,
                            is_premium: !!(item.isPremium || item.is_premium)
                          })}
                          className="py-4 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm h-full"
                          style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}
                        >
                          <Instagram size={16} /> Instagram
                        </a>
                      </>
                    );
                  } else {
                    return (
                      <>
                        <a 
                          href={bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackEvent('booking_lead', item.category, item.title)}
                          className="py-2 px-3 bg-[#003580] text-white font-bold rounded-2xl hover:bg-[#002252] shadow-lg shadow-blue-900/20 transition-all flex flex-col items-center justify-center gap-0.5 text-xs transform active:scale-95 h-full"
                        >
                          <div className="flex items-center gap-1.5">
                            <Calendar size={18} />
                            <span>Reservar na</span>
                          </div>
                          <span className="font-extrabold text-[13px] tracking-tight">Booking.com</span>
                        </a>
                        <a 
                          href={item.instagram || item.link_instagram || "https://www.instagram.com/vemprapenedo/"}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => pushInstagramClick({
                            business_id: item.id,
                            business_name: item.title,
                            business_category: item.category,
                            is_premium: !!(item.isPremium || item.is_premium)
                          })}
                          className="py-4 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm h-full"
                          style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}
                        >
                          <Instagram size={16} /> Instagram
                        </a>
                      </>
                    );
                  }
                } else {
                  return (
                    <>
                      <a 
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => pushWhatsappClick({
                          business_id: item.id,
                          business_name: item.title,
                          business_category: item.category,
                          is_premium: !!(item.isPremium || item.is_premium)
                        })}
                        className="py-4 bg-[#25D366] text-white font-bold rounded-2xl hover:bg-[#128C7E] shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2 text-sm transform active:scale-95"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                        </svg> WhatsApp
                      </a>
                      <a 
                        href={item.instagram || item.link_instagram || "https://www.instagram.com/vemprapenedo/"}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => pushInstagramClick({
                          business_id: item.id,
                          business_name: item.title,
                          business_category: item.category,
                          is_premium: !!(item.isPremium || item.is_premium)
                        })}
                        className="py-4 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm"
                        style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}
                      >
                        <Instagram size={16} /> Instagram
                      </a>
                    </>
                  );
                }
              })()}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
