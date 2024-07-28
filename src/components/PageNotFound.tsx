import "../CSS/PageNotFound.css";
function PageNotFound() {
  return (
    <div className="h-full w-full flex justify-center items-center flex-col">
      <h1 className="w-full uppercase font-Bebas_Neue text-6xl mt-16 pl-24">
        404 Not found
      </h1>
      <div className="flex justify-between w-10/12">
        <div className="flex">
          <img
            src="/Scarecrow.png"
            className="h-[35rem] w-[35rem]"
            alt="404-Scarecrow"
          />
        </div>
        <div className="flex flex-col justify-evenly w-1/2">
          <h2 className="font-Bebas_Neue text-7xl">I have bad news for you</h2>
          <p className="font-Nunito text-4xl">
            The page you are looking for might be removed or is temporarily
            unavailable
          </p>
          <a href="/dashboard" className="bn13 w-fit">
            Back to homepage
          </a>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
