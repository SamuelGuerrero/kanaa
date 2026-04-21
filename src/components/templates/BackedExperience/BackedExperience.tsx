"use client";

import { useEffect, useState } from "react";

import { Text } from "@/components/atoms";
import { TestimonialCarousel, type Testimonial } from "@/components/organisms";
import { useItemsPerPage } from "@/hooks/useItemsPerPage";

const mockTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Jaime",
    role: "Huésped",
    rating: 5,
    testimonial:
      "Es un lugar genial, con una arquitectura preciosa y ubicado en la mejor parte de la ciudad. La casa se ve y es exactamente como las fotos. Recomiendo encarecidamente este alojamiento para disfrutar de la belleza que la ciudad tiene para ofrecer a su manera única.",
    avatarUrl:
      "https://a0.muscache.com/im/pictures/user/User-229491415/original/38f81329-fd41-4610-b923-6caacc69af03.png?im_w=720",
  },
  {
    id: 2,
    name: "John",
    role: "Huésped",
    rating: 5,
    testimonial:
      "Kanaa me ha ayudado a gestionar mis propiedades de manera eficiente. El soporte técnico es excelente.",
    avatarUrl:
      "https://a0.muscache.com/im/pictures/user/16437f8e-5e51-4be7-b29c-21f59de5e58d.jpg?im_w=720",
  },
  {
    id: 3,
    name: "Fernanda",
    role: "Huésped",
    rating: 5,
    testimonial:
      "Increíble atención al cliente y una propiedad de primera clase. Sin duda mi primera opción para futuras vacaciones.",
    avatarUrl:
      "https://a0.muscache.com/im/pictures/user/4f86e60e-fbb4-4dd9-b461-4bc904780c47.jpg?im_w=720",
  },
  {
    id: 4,
    name: "Kseniia",
    role: "Huésped",
    rating: 5,
    testimonial:
      "Wow! Casa increíble! Este lugar muy bonito, limpio, tranquilo. Habitaciones muy espaciosas, las camas muy cómodas. Tiene todo lo que necesitas. Este airbnb es la mejor de la ciudad.",
    avatarUrl:
      "https://a0.muscache.com/im/pictures/user/User-243472200/original/555397f4-79a2-4cdf-aa69-a5e3641f6f74.jpeg?im_w=720",
  },
  {
    id: 5,
    name: "Alejandro",
    role: "Huésped",
    rating: 5,
    testimonial:
      "Casa preciosa súper bien ubicada, a solo unas cuadras del centro, súper atentos y muy al pendiente de tus necesidades",
    avatarUrl:
      "https://a0.muscache.com/im/pictures/user/User/original/68cd0545-a2da-48b3-bbd2-4759aff0f54a.jpeg?im_w=720",
  },
  {
    id: 6,
    name: "Susan",
    role: "Huésped",
    rating: 5,
    testimonial:
      "Tuvimos una gran estadía aquí. El departamento está perfectamente ubicado pero en una calle tranquila, por lo que hay muy poco ruido. El apartamento estaba limpio y el complejo era seguro. Con mucho gusto me hospedaría de nuevo.",
    avatarUrl:
      "https://a0.muscache.com/im/pictures/user/bcca4b30-dfc7-4b60-aa22-218234e0d0f1.jpg?im_w=240",
  },
  {
    id: 7,
    name: "André",
    role: "Huésped",
    rating: 5,
    testimonial:
      "¡Uno de los mejores alojamientos que hemos alquilado en los últimos años!   Y el anfitrión fue muy servicial, ¡fue perfecto!",
    avatarUrl:
      "https://a0.muscache.com/im/pictures/user/94bb7871-2ea2-405c-a504-c47db6b4510b.jpg?im_w=720",
  },
  {
    id: 8,
    name: "Alix",
    role: "Huésped",
    rating: 5,
    testimonial:
      "Reserva de último minuto, por la mañana para esa misma noche. Todo el mundo quedó encantado con la casa. Todo estuvo perfecto. La casa es magnífica, bien equipada. Comunicación perfecta y fluida.",
    avatarUrl:
      "https://a0.muscache.com/im/pictures/user/User/original/521cea88-93c2-44ba-82e2-e258f1632493.jpeg?im_w=720",
  },
  {
    id: 9,
    name: "Alayna",
    role: "Huésped",
    rating: 5,
    testimonial:
      "¡Eugenio fue un anfitrión maravilloso y siempre respondió! ¡Dio excelentes opciones para actividades que hacer en la ciudad, y la casa está justo en el centro de Mérida! 10/10 me hospedaría de nuevo.",
    avatarUrl:
      "https://a0.muscache.com/im/pictures/user/User/original/2e0dc84a-ab73-4781-9ca8-22afdd196eeb.jpeg?im_w=720",
  },
];

type BackedExperienceProps = {
  title?: string;
  description?: string;
  testimonials?: Testimonial[];
};

export const BackedExperience = ({
  title = "Experiencias que se sienten",
  description = "Descubre cómo cada estancia con Kanaa se convierte en momentos memorables, pensados para disfrutar sin preocupaciones.",
  testimonials: testimonialsProp,
}: BackedExperienceProps) => {
  const source = testimonialsProp ?? mockTestimonials;
  const itemsPerPage = useItemsPerPage(1, 1, 2, 3);
  const [displayedTestimonials, setDisplayedTestimonials] = useState(source);

  useEffect(() => {
    setDisplayedTestimonials(source.slice(0, itemsPerPage * 3));
  }, [itemsPerPage, source]);

  return (
    <section className="flex flex-col items-center bg-white px-4 py-5 md:py-16 md:text-center">
      <Text size="5xl" className="text-green-normal mr-10 mb-10">
        {title}
      </Text>
      <Text font="gilroy" size="lg" className="text-grey-darker mt-6 mr-5 mb-8">
        {description}
      </Text>
      <TestimonialCarousel
        testimonials={displayedTestimonials}
        itemsPerPage={itemsPerPage}
      />
    </section>
  );
};
