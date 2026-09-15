import { CirclePlus, ClipboardList } from "lucide-react";
import EngagementForm from "../components/EngagementForm";

const AddingComponent = ({
  showModal,
  setShowModal,
  title,
  subTitle,
  btnTxt,
}) => {
  return (
    <>
      <main className="h-full min-h-0 overflow-x-hidden overflow-y-auto bg-[#f7f9fb] pt-[62px] text-[#1d2e43]">
        <div className="mx-auto max-w-[1440px] borde h-full flex flex-col justify-center items-center px-4 py-7 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-0.5 items-center">
            <div className="bg-[#e8ecf1] rounded-lg w-16 h-16 flex justify-center items-center">
              <ClipboardList className="size-9" />
            </div>
            <h2 className="text-[25px] font-semibold text-[#172b44]">
              {title}
            </h2>
            <span className="mt-1 text-xs text-[#8b9aab]">{subTitle}</span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="h-10 mt-5 rounded-xl bg-[#223650] px-4 text-white hover:bg-[#243447]"
          >
            <div className="flex items-center gap-1">
              <CirclePlus />
              <span>{btnTxt}</span>
            </div>
          </button>
          {showModal && <EngagementForm onClose={() => setShowModal(false)} />}
        </div>
      </main>
    </>
  );
};

export default AddingComponent;
