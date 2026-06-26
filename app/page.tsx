import Calculator from "@/components/Calculator";
import DailyDrawdownCalculator from "@/components/DailyDrawdownCalculator";

export default function Page() {
  return (
    <main>
      <div className="grid w-full max-w-[520px] gap-8">
        <Calculator />
        <DailyDrawdownCalculator />
      </div>
    </main>
  );
}
