import Tab from "./_components/tabs";

const Page = () => {
  return (
    <div>
      <div className="h-14 flex items-center  border border-gray-100">
        <h1 className="text-base font-semibold ml-12">AI tools</h1>
      </div>
      <div className="flex justify-center">
        <div className="w-145 mt-6">
          <Tab />
        </div>
      </div>
    </div>
  );
};

export default Page;
