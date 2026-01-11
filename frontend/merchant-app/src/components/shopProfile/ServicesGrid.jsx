import { services } from "../../data/services";

const ServicesGrid = () => {
  return (
    <div className="px-4 pt-4">
      <div className="grid grid-cols-3 gap-4">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-md shadow-sm py-4 px-1 flex flex-col items-center justify-center active:scale-95 transition">
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full ${service.bg}`}>
                <Icon className={`w-6 h-6 ${service.iconColor}`} />
              </div>

              <p className="mt-3 text-sm font-medium text-gray-700 text-center">
                {service.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesGrid;
