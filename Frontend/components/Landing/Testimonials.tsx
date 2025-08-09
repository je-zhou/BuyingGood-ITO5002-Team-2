"use client";

import React from "react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

interface Testimonial {
  name: string;
  location: string;
  quote: string;
  story: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Bill",
    location: "Lissner QLD 4820",
    quote:
      "I grow the best avocados you can get, but for many years it felt like I was running a trucking company, not a farm.",
    story:
      "A lot goes into running a farm so I don't have time to do the marketing side of things. For the longest time I had two main buyers and they wanted to take the produce on a truck to their facilities before going to the shops. I see my label on the avocados at the shops but they don't look the same way as they did when they left my farm. It was really hard to see that.\n\nA mate of mine told me about BuyingGood. He said it helps me put my farm out there and show people what I do. I hardly use computers but gave it a go signing up and all. It was so easy to use, I couldn't believe it. Before I knew it, I got an email from a local grocery store wanting to stock my avocados so I set aside a couple boxes for them every week. Then another email came, and another email came, and more emails came. I've even got people emailing me from overseas these days.\n\nThe best thing about this is that people see my label and get the avocados I grew in its best form.",
  },
  {
    name: "Sarah",
    location: "Nelly Bay QLD 4819",
    quote:
      "My customers want local, and I want to give it to them. But I'm a shop owner, not a logistics expert. I need it to be simple.",
    story:
      "Through BuyingGood, I found a small farm that does a range of unique and higher-quality produce. Gia's farm uses hydroponics technologies that grow produce in a controlled environment meaning more reliable supply, more guarantee in quality, and less pests. It was just down the road from where my mum lives so I just swing by to pick up my stock when I visit mum.\n\nGia's unique produce has brought a lot of interest to our store as she keeps a few staples like lettuces and other salad leaves, but has a range of more exotic fruits and veges on offer too. It creates a lot of conversation with customers and encourages everyone to change up their cooking and try new things.",
  },
  {
    name: "Chloe",
    location: "Oorindi QLD 4824",
    quote:
      "I want my spending to support my community. Just make it easy for me to find and buy the amazing food that's grown right here.",
    story:
      "I've lived in the same community all my life. Just about every 5th person I talk to works at or owns a farm. The sticky beak of me has always wondered what everyone grows on their farms, but more importantly, do we really need to buy spring onions from the other side of Australia? Does nobody grow spring onions near-by? Signing up to BuyingGood answered so many questions. At my finger tips, I know who grows what during which months, and how far away they are from me.\n\nLast Christmas, I made my whole extended family strawberry jam as presents. Boy, I bought a lot of strawberries. They were probably the biggest, sweetest, and freshest strawberries I've ever had and it didn't cost half as much as it does at the supermarket!",
  },
  {
    name: "Marcus",
    location: "Townsville QLD 4810",
    quote:
      "Running a restaurant means I need fresh ingredients daily. BuyingGood connected me directly with local growers who understand quality.",
    story:
      "As a chef, I've always been passionate about using the freshest local ingredients, but finding reliable suppliers was a nightmare. I was stuck dealing with big distributors who couldn't guarantee when produce was actually harvested or how long it had been sitting in warehouses.\n\nBuyingGood changed everything for me. Now I work directly with three local farms that supply my restaurant with herbs, vegetables, and even some specialty items I never thought I could source locally. The farmers understand my needs and even grow specific varieties I request for seasonal menus.\n\nMy customers constantly comment on how fresh and flavorful everything tastes. Last month, a food critic wrote that our salads tasted like they were 'picked that morning' - and they literally were! It's not just about the food quality either, my ingredient costs have dropped by 30% since cutting out the middlemen.",
  },
  {
    name: "Jenny",
    location: "Cairns QLD 4870",
    quote:
      "I wanted to start a small market garden but had no idea how to reach customers. BuyingGood gave me the confidence to turn my backyard hobby into a real business.",
    story:
      "After retiring from teaching, I started growing vegetables in my backyard just for fun. Friends kept telling me my tomatoes and herbs were better than anything they could buy in stores, but I never thought about selling them until my neighbor mentioned BuyingGood.\n\nI was nervous about setting up an online presence - I'm not exactly tech-savvy - but the platform made it so simple. Within a week, I had my first customer order for basil and cherry tomatoes. Now, six months later, I'm supplying five local cafes and a dozen families with fresh produce every week.\n\nWhat I love most is the relationships I've built. My customers know exactly who grows their food, and I know exactly where my vegetables are going. It's created this wonderful sense of community that I never expected.",
  },
  {
    name: "David",
    location: "Mackay QLD 4740",
    quote:
      "My kids were asking where their food comes from. BuyingGood helped us connect with our local food system and teach them about sustainability.",
    story:
      "My wife and I have been trying to raise our kids to be more conscious about what they eat and where it comes from. We started shopping at farmers markets, but it wasn't always convenient with three young kids in tow.\n\nBuyingGood was perfect for our family. We can browse local farms online, read about their growing practices, and even arrange visits to see where our food is grown. My 8-year-old son is now obsessed with composting after visiting the farm where we buy our vegetables.\n\nThe convenience factor is huge too. I can place orders during my lunch break at work, and we either pick up directly from farms on weekend family outings, or have everything delivered. It's turned grocery shopping from a chore into an educational experience for the whole family.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-green-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Community Says
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from farmers, shop owners, and customers who are
            transforming their local food systems with BuyingGood.
          </p>
        </div>
      </div>

      <div className="w-full px-12 md:px-24">
        <Carousel
          opts={{
            align: "start",
            loop: true,
            skipSnaps: false,
            dragFree: false,
          }}
          className="w-full max-w-7xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={index}
                className="md:basis-[47%] basis-full m-4"
              >
                <div className="h-full p-2">
                  <div className="bg-white rounded-xl shadow-lg p-2 md:p-4 h-full">
                    <div className="flex flex-col h-full">
                      <div className="mb-6">
                        <div className="text-5xl md:text-6xl text-green-600 mb-4">
                          &ldquo;
                        </div>
                        <blockquote className="text-lg md:text-xl font-medium text-gray-900 italic leading-relaxed">
                          {testimonial.quote}
                        </blockquote>
                      </div>

                      <div className="flex-grow">
                        <div className="text-gray-700 leading-relaxed space-y-3 md:space-y-4 text-sm md:text-base">
                          {testimonial.story
                            .split("\n\n")
                            .map((paragraph, pIndex) => (
                              <p key={pIndex}>{paragraph}</p>
                            ))}
                        </div>
                      </div>

                      <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
                        <div className="flex items-center">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-green-600 rounded-full flex items-center justify-center mr-3 md:mr-4">
                            <span className="text-white font-semibold text-base md:text-lg">
                              {testimonial.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm md:text-base">
                              {testimonial.name}
                            </p>
                            <p className="text-gray-600 text-xs md:text-sm">
                              {testimonial.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-12 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg border-0" />
          <CarouselNext className="-right-12 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg border-0" />
        </Carousel>
      </div>

      <div className="w-full bg-green-50 py-16 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-green-100">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Have Your Own Story to Share?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Have feedback? Let us know how BuyingGood has worked for you. We&apos;d love to hear about your experience!
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                Share Your Feedback
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
