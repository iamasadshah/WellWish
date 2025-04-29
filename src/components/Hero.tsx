import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className=" min-h-screen pt-24 px-4 overflow-hidden">
      <div className="container bg-gradient-to-br from-[#aaecf9] to-[#00b4d8] rounded-blob mx-auto flex flex-col-reverse lg:flex-row items-center max-w-6xl rounded-2xl px-6">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 space-y-6 pt-8 lg:pt-0">
          <span className="inline-block bg-primary-dark/10 text-primary-dark px-4 py-2 rounded-full text-sm font-medium">
            #wellwish
          </span>

          <h1 className="text-3xl md:text-5xl font-bold text-primary-dark leading-tight">
            Your Wish for Care, <br /> Our Mission to Deliver.
          </h1>

          <p className="text-lg md:text-xl text-primary leading-relaxed">
            At WellWish, we don't just connect users — we connect hearts.
            Because sometimes, a little care is all it takes to change a life.
          </p>

          <Link
            href="/signup"
            className="inline-flex items-center bg-white text-[#00b4d8] px-8 py-3 rounded-full hover:bg-primary transition-colors text-lg font-medium group"
          >
            Start free today
            <svg
              className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {/* Right Image */}
        <div className="w-full lg:w-1/2 relative ">
          <div className="relative w-full aspect-square max-w-[500px] mx-auto ">
            {/* Background Shapes */}
            <div className="absolute  inset-0 bg-primary/20 rounded-blob transform rotate-45 animate-pulse"></div>
            <div className="absolute  inset-4 bg-primary-light/30 rounded-blob transform -rotate-12"></div>

            {/* Main Image Container */}
            <div className="absolute inset-8 overflow-hidden rounded-blob transform rotate-12 ">
              <Image
                src="/assets/hero-image.jpg"
                alt="Caring professional helping someone"
                fill
                className="object-cover transform -rotate-12 hover:scale-110 transition-transform duration-500"
                priority
              />
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-lightest rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-dark/20 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
