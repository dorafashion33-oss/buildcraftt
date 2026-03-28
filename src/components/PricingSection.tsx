import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for exploring and personal projects",
    features: ["3 projects", "AI code generation", "Live preview", "Community support"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "For professionals building production apps",
    features: ["Unlimited projects", "Advanced AI models", "Custom domains", "Team collaboration", "Priority support", "One-click deploy"],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations at scale",
    features: ["Everything in Pro", "SSO & SAML", "Dedicated infrastructure", "SLA guarantee", "Custom integrations", "Dedicated success manager"],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const PricingSection = () => {
  return (
    <section className="py-32 px-6 relative" id="pricing">
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-mono text-primary tracking-widest uppercase">Pricing</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-3 mb-4">
            Start free, <span className="gradient-text">scale infinitely</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            No credit card required. Upgrade when you're ready.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl p-8 ${plan.highlighted ? 'bg-card gradient-border glow-primary' : 'bg-card border border-border'}`}
            >
              <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
              <div className="mt-4 mb-2">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
              </div>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
              <Button variant={plan.highlighted ? "hero" : "hero-outline"} className="w-full mb-6">
                {plan.cta}
              </Button>
              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-secondary-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
