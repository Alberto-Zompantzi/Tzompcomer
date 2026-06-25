
const Locations = () => {
  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-[#121212] mb-4">
            Visita nuestra sucursal
          </h2>
          <p className="text-lg text-gray-600">
            Encuéntranos fácilmente en el corazón de Teziutlán
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Sucursal Info */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 h-16 bg-[#0033A0] rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9A2 2 0 0110.586 20.9L6.343 16.657a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#121212] mb-2">
                    Ubicación Principal
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Calle Xicoténcatl 318, Centro
                  </p>
                  <p className="text-gray-600">73800 Teziutlán, Puebla</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    className="w-5 h-5 text-[#0033A0]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span className="font-semibold text-gray-800">Horario</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Lunes a Domingo: 8:00 AM - 8:00 PM
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    className="w-5 h-5 text-[#0033A0]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.916 5.916l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    ></path>
                  </svg>
                  <span className="font-semibold text-gray-800">Contacto</span>
                </div>
                <p className="text-gray-600 text-sm">(231) 119-5205</p>
              </div>
            </div>
          </div>

          {/* Google Maps */}
          <div className="h-[500px] bg-gray-100 rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              title="Ubicación de Tzompcomer"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3073.036196302603!2d-97.35687169414176!3d19.818061025547227!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85daeb0031b4b8d7%3A0xecc84ee4452c2392!2sTzompcomer!5e0!3m2!1sen!2sus!4v1782343685353!5m2!1sen!2sus"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Locations;
