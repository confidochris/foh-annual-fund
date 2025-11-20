import NextSection from './NextSection';

export default function AnnualFund() {
  return (
    <section id="annual-fund" className="py-20 bg-gradient-to-b from-white to-foh-lime/5">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foh-dark-brown mb-6">
            What Is the Annual Fund?
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8">
            The Annual Fund is our year-end campaign that fuels what matters most: <em>breakthrough research on mental illness</em>.
          </p>
        </div>

        <div className="bg-gradient-to-br from-foh-lime/20 via-white to-foh-mid-green/10 rounded-2xl shadow-lg p-8 md:p-12 mb-8 border border-foh-lime/30">
          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            At the Foundation of Hope, <span className="font-bold text-foh-mid-green">100% of every dollar</span> given to the Annual Fund goes directly to research — the studies, ideas, and discoveries driving real solutions across the full spectrum of mental illnesses.
          </p>
          <p className="text-lg text-gray-800 leading-relaxed">
            Thanks to our incredible year-round supporters, this campaign stays laser-focused on progress and innovation when it's needed most.
          </p>
        </div>

        <div className="text-center">
          <div className="inline-block bg-foh-mid-green text-white px-8 py-6 rounded-xl">
            <p className="text-2xl md:text-3xl font-bold">100% to research. 100% to hope.</p>
          </div>
        </div>

        <NextSection targetId="story" label="The Story" />
      </div>
    </section>
  );
}
