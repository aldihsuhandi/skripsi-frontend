import { HiXCircle } from "react-icons/hi2";

export const NotFoundWidget = ({ name }: { name: string }) => {
  return (
    <>
      <div className="flex h-auto w-full flex-col items-center justify-center p-10  opacity-30">
        <HiXCircle className="h-64 w-64 text-red-300" />
        <p>There is no {name}</p>
      </div>
    </>
  );
};
