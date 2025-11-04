import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Sprout, Users, Shield, TrendingUp, ArrowRight, Loader2, Leaf, Heart } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src="/logo.svg" alt="Logo" className="h-12 w-12" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Kisan Bazaar
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => navigate("/marketplace")} className="hover:bg-primary/10">
                  Marketplace
                </Button>
                <Button onClick={() => navigate("/farmer/dashboard")} className="bg-primary hover:bg-primary/90">
                  Dashboard
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate("/auth")} className="bg-primary hover:bg-primary/90">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary/30 mb-8">
            <Leaf className="h-5 w-5 text-primary animate-bounce" />
            <span className="text-sm font-semibold text-primary">किसान बाज़ार - Smart Agriculture Marketplace</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Connect Farmers
            </span>
            <br />
            <span className="text-muted-foreground">with Customers</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            A modern platform bringing fresh produce directly from farms to your table.
            <span className="text-primary font-semibold"> AI-powered disease detection</span> ensures quality crops.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleGetStarted} 
              className="text-lg px-10 py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate("/marketplace")} 
              className="text-lg px-10 py-6 border-2 border-primary hover:bg-primary/10"
            >
              Browse Marketplace
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold tracking-tight text-center mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Why Choose Kisan Bazaar?
            </span>
          </h2>
          <p className="text-center text-muted-foreground mb-16 text-lg">
            Connecting communities through fresh, quality produce
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform border-2 border-primary/20">
                <Sprout className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fresh Produce</h3>
              <p className="text-muted-foreground leading-relaxed">
                Direct from farms to ensure maximum freshness and quality
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform border-2 border-accent/20">
                <Shield className="h-10 w-10 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Health Check</h3>
              <p className="text-muted-foreground leading-relaxed">
                Advanced disease detection to ensure crop quality and safety
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform border-2 border-secondary/20">
                <Users className="h-10 w-10 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Direct Connection</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect directly with local farmers for better prices
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform border-2 border-primary/20">
                <TrendingUp className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fair Pricing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Transparent pricing that benefits both farmers and customers
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 border-2 border-primary/20 rounded-3xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <Heart className="h-12 w-12 mx-auto mb-4 text-accent animate-pulse" />
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Ready to Get Started?
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of farmers and customers on our platform
            </p>
            <Button 
              size="lg" 
              onClick={handleGetStarted} 
              className="text-lg px-10 py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all"
            >
              Join Kisan Bazaar Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            © 2024 Kisan Bazaar. Built with 
            <Heart className="h-4 w-4 text-accent fill-accent animate-pulse" /> 
            for farmers and customers.
          </p>
        </div>
      </footer>
    </div>
  );
}