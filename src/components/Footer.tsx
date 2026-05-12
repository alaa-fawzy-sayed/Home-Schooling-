import { Link } from "@tanstack/react-router";
import { Send, MessageCircle, Globe2, PlayCircle, MapPin, Phone, Mail, GraduationCap } from "lucide-react";
import { useApp } from "@/lib/i18n";
import { departments } from "@/lib/mock-data";
import logo from "@/assets/logo.png";

export default function Footer() {
  const { t, lang } = useApp();
  return (
    <footer className="mt-20 border-t border-border glass">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="relative">
                <img src={logo} alt="" className="h-12 w-12 rounded-lg neon-glow" />
                <GraduationCap className="absolute -top-1 -right-1 h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-display font-bold gradient-text text-sm">E-Learning Nova</div>
                <div className="font-display font-black neon-text text-sm">UNIVERSITY</div>
              </div>
            </Link>
            <p className="text-muted-foreground text-xs leading-relaxed">{t("footer.tagline")}</p>
            <div className="flex gap-2 mt-4">
              {[Send, MessageCircle, Globe2, PlayCircle].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-lg glass hover:neon-border transition-all">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm gradient-text">{t("footer.programs")}</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {departments.slice(0, 5).map((d) => (
                <li key={d.id}>
                  <Link to="/departments/$deptId" params={{ deptId: d.id }} className="hover:text-primary transition-colors">
                    {lang === "ar" ? d.nameAr : d.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm gradient-text">{t("footer.about")}</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary">{t("nav.about")}</Link></li>
              <li><Link to="/contact" className="hover:text-primary">{t("nav.contact")}</Link></li>
              <li><Link to="/courses" className="hover:text-primary">{t("nav.courses")}</Link></li>
              <li><Link to="/live" className="hover:text-primary">{t("nav.live")}</Link></li>
              <li><Link to="/books" className="hover:text-primary">{t("nav.books")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm gradient-text">{t("footer.contact")}</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2"><MapPin className="h-3 w-3 mt-0.5 text-primary shrink-0" />Digital Campus, Cairo, Egypt</li>
              <li className="flex items-center gap-2"><Phone className="h-3 w-3 text-primary" />+20 100 000 0000</li>
              <li className="flex items-center gap-2"><Mail className="h-3 w-3 text-primary" />info@nova.edu</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} E-Learning Nova University. {t("footer.rights")}.</div>
          <div className="flex items-center gap-4">
            <span>🇪🇬 معتمدة دوليًا</span>
            <span>ISO 9001:2015</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
