import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

export const swiper = () => {
   return new Swiper('.mySwiper', {
     modules: [Navigation],
     navigation: {
       nextEl: '.swiper-button-next',
       prevEl: '.swiper-button-prev'
     },
     slidesPerView: 'auto',
     mousewheel: true,
     freeMode: true,
     speed: 200
    });
};
