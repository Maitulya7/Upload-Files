import Dropzone from "@/app/components/Dropzone";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <nav className="lg:p-10  p-5 flex items-center justify-between">
          <Image src="/logo.png" alt="image" width={120} height={120} />
          <a
            href="https://github.com/Maitulya7/Upload-Files"
            target="_blank"
            rel="noopener noreferrer"
            className="lg:w-40  lg:h-10 w-28 h-8  bg-black rounded text-white font-semibold hover:bg-slate-800 flex items-center justify-center"
          >
            <span>Github</span>
          </a>
        </nav>

        <section className="py-4 md:py-8 lg:py-12">
          <div className="container p-10 mx-auto">
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
              File Upload Section
            </h1>
            <div className="flex flex-wrap -mx-2">
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="w-full md:w-full lg:w-1/2 xl:w-1/3 px-2 mb-4"
                >
                  <div className="border border-neutral-300 p-3 hover:cursor-pointer shadow-md rounded-md">
                    <h2 className="text-sm md:text-base font-bold mb-3 md:mb-4">
                      Upload Files
                    </h2>
                    <Dropzone />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <footer className="mt-auto py-6 bg-slate-900 text-neutral-200">
          <div className="container mx-auto text-center">
            <p className="text-sm">
              &copy; 2024 Maitulya Vaghela. All rights reserved.
            </p>
            <p className="text-sm mt-2">
              Built with ❤️ using Next.js and Tailwind CSS
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
