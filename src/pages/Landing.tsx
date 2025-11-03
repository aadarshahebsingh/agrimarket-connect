import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Sprout, Users, Shield, TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/marketplace");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Logo" className="h-10 w-10" />
            <h1 className="text-xl font-bold tracking-tight">AgriMarket</h1>
          </div>
          <div className="flex items-center gap-4">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => navigate("/marketplace")}>
                  Marketplace
                </Button>
                <Button onClick={() => navigate("/farmer/dashboard")}>
                  Dashboard
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted mb-8">
            <Sprout className="h-4 w-4" />
            <span className="text-sm font-medium">Smart Agriculture Marketplace</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Connect Farmers
            <br />
            <span className="text-muted-foreground">with Customers</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            A modern platform bringing fresh produce directly from farms to your table.
            AI-powered disease detection ensures quality crops.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted} className="text-lg px-8">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/marketplace")} className="text-lg px-8">
              Browse Marketplace
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24 max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-center mb-16">
            Why Choose AgriMarket?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sprout className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold mb-2">Fresh Produce</h3>
              <p className="text-muted-foreground">
                Direct from farms to ensure maximum freshness and quality
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold mb-2">AI Health Check</h3>
              <p className="text-muted-foreground">
                Advanced disease detection to ensure crop quality and safety
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold mb-2">Direct Connection</h3>
              <p className="text-muted-foreground">
                Connect directly with local farmers for better prices
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold mb-2">Fair Pricing</h3>
              <p className="text-muted-foreground">
                Transparent pricing that benefits both farmers and customers
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-card border rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of farmers and customers on our platform
          </p>
          <Button size="lg" onClick={handleGetStarted} className="text-lg px-8">
            Join AgriMarket Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 AgriMarket. Built with ❤️ for farmers and customers.</p>
        </div>
      </footer>
    </div>
  );
}