import { ArrowLeft, Construction, ShieldCheck, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ComingSoon = ({ section }) => {
  const navigate = useNavigate();
  const isPermissions = section === "Permissions";
  const SectionIcon = isPermissions ? ShieldCheck : Settings;

  return (
    <main className="flex min-h-full items-center justify-center bg-[#f7f9fb] px-4 py-10 text-[#1d2e43]">
      <section className="w-full max-w-xl rounded-2xl border border-[#e3e8ed] bg-white px-6 py-12 text-center shadow-sm sm:px-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf3f8] text-[#456681]">
          <SectionIcon size={30} strokeWidth={1.7} />
        </div>
        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8b9aab]">
          {section}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[#172b44]">
          Coming soon
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#8b9aab]">
          This {section.toLowerCase()} workspace is under construction. It will
          be available in a future update.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-lg bg-[#faf4e8] px-3 py-2 text-xs font-semibold text-[#846f46]">
            <Construction size={15} /> Under Construction
          </span>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-lg bg-[#223650] px-4 py-2 text-xs font-semibold text-white"
          >
            <ArrowLeft size={15} /> Back to Dashboard
          </button>
        </div>
      </section>
    </main>
  );
};

export default ComingSoon;
