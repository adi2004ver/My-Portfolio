import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DraggableCanvas from "@/components/DraggableCanvas";
import CanvasCard from "@/components/CanvasCard";
import ClientInfoBar from "@/components/ClientInfoBar";
import Button3D from "@/components/Button3D";
import MusicVinylTile from "@/components/MusicVinylTile";
import DrawTile from "@/components/DrawTile";
import BucketListTile from "@/components/BucketListTile";
import MiniGameTile from "@/components/MiniGameTile";
import FidgetSpinnerTile from "@/components/FidgetSpinnerTile";
import { useAltName } from "@/hooks/use-alt-name";
import {
  FolderOpen, Camera, ArrowRight, Sparkles, Code, GraduationCap, Coffee, Music, ArrowLeft
} from "lucide-react";
import { experiences, education, socialLinks } from "@/data/profile";
import profileAvatar from "@/assets/profile-avatar.png";
import { stickers } from "@/data/stickers";
import Sticker from "@/components/Stickers";

// Tighter canvas - no wasted space
const CW = 2200;
const CH = 1700;
const CX = CW / 2; // 1100
const CY = CH / 2; // 850
const GAP = 52;

const Home = () => {
  const navigate = useNavigate();
  const { isAltName } = useAltName();

  return (
    <>
      <DraggableCanvas width={CW} height={CH} initialFocus={{ x: CX, y: CY - 60 }}>

        {/* ========== CORE CENTER CLUSTER ========== */}

        {/* Main Profile Card */}
        <CanvasCard
          style={{ left: CX - 270, top: CY - 340 }}
          className="w-[540px] p-5 z-20"
        >
          <div className="flex items-center gap-4 mb-5">
            <img src={profileAvatar} alt="Aditya Kumar Verma" className="w-14 h-14 rounded-full object-cover object-top ring-2 ring-border shadow-lg" />
            <div>
              <h1 className="text-xl font-bold text-card-foreground font-heading">Aditya Kumar Verma</h1>
              <p className="text-sm text-muted-foreground">Cloud Engineer & Data Analyst</p>
              <p className="text-xs text-muted-foreground mt-0.5">Gurugram, India</p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-card-foreground mb-5">
            Motivated Computer Science Engineering student with hands-on experience in ASP.NET WebForms, SQL, and Java development, with strong interest in AI and Data Science.
          </p>

          {/* Experience */}
          <div className="mb-5">
            <div className="space-y-2">
              {experiences.map((exp) => (
                <div key={exp.company} className="py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3 mb-1">
                    <div className={`w-2.5 h-2.5 rounded-sm shrink-0 ${exp.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-card-foreground">{exp.company}</p>
                      <p className="text-xs text-muted-foreground">{exp.role}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{exp.period}</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-5 leading-relaxed">{exp.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-sm font-bold font-heading text-card-foreground">Education</h2>
            </div>
            {education.map((edu) => (
              <div key={edu.school} className="py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3 mb-1">
                  <div className={`w-2.5 h-2.5 rounded-sm shrink-0 ${edu.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-card-foreground">{edu.school}</p>
                    <p className="text-xs text-muted-foreground">{edu.course}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{edu.period}</span>
                </div>
                <p className="text-xs text-primary/80 ml-5 font-medium">{edu.gpa}</p>
              </div>
            ))}
          </div>

          {/* Social */}
          <div className="flex flex-wrap gap-2 mb-3">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                <Button3D size="sm"><Icon className="w-4 h-4" />{label}</Button3D>
              </a>
            ))}
          </div>
          <ClientInfoBar />
        </CanvasCard>

        {/* Projects Card - right of center */}
        <CanvasCard
          style={{ left: CX + 324, top: CY - 280 }}
          className="w-[320px] p-5"
          onClick={() => navigate("/projects")}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold font-heading text-card-foreground">Projects</h2>
              <p className="text-xs text-muted-foreground">Featured work</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Machine learning, data-driven systems, and collaborative tools.
          </p>
          <Button3D size="sm" onClick={() => navigate("/projects")}>
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Button3D>
        </CanvasCard>

        {/* Skills Card - below projects */}
        <CanvasCard
          style={{ left: CX + 324, top: CY + 26 + GAP }}
          className="w-[320px] p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-accent/10 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-accent" />
            </div>
            <h2 className="text-sm font-bold font-heading text-card-foreground">Tech Stack</h2>
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <p className="font-semibold text-card-foreground mb-0.5">Languages</p>
              <p className="text-muted-foreground">Python • C# • Java • SQL • HTML</p>
            </div>
            <div>
              <p className="font-semibold text-card-foreground mb-0.5">Frameworks</p>
              <p className="text-muted-foreground">.NET • Data Analysis • AI Tools</p>
            </div>
            <div>
              <p className="font-semibold text-card-foreground mb-0.5">Tools</p>
              <p className="text-muted-foreground">MS SQL Server • MySQL</p>
            </div>
          </div>
        </CanvasCard>

        {/* Photos link - below main card */}
        <CanvasCard
          style={{ left: CX - 270, top: CY + 494 }}
          className="w-56 p-4"
          onClick={() => navigate("/photos")}
        >
          <div className="flex items-center gap-2 mb-2">
            <Camera className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold font-heading text-card-foreground">Photos</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Moments captured through my lens.</p>
          <Button3D size="sm" onClick={() => navigate("/photos")}>Gallery <ArrowRight className="w-3 h-3" /></Button3D>
        </CanvasCard>

        {/* Beyond Work page link */}
        <CanvasCard
          style={{ left: CX + 6, top: CY + 494 }}
          className="w-56 p-4"
          onClick={() => navigate("/beyond-work")}
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold font-heading text-card-foreground">{isAltName ? "Side Quests ✦" : "Beyond Work ✦"}</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Music, movies, and obsessions.</p>
          <Button3D size="sm" onClick={() => navigate("/beyond-work")}>Explore <ArrowRight className="w-3 h-3" /></Button3D>
        </CanvasCard>

        {/* ========== EXPLORATION CONTENT ========== */}

        {/* Drawing tile - top left */}
        <CanvasCard
          style={{ left: 90 + GAP, top: 120 }}
          rotation={-3}
          variant="note"
          className="w-[400px] h-[400px] p-0 shadow-lg border-none overflow-hidden"
        >
          <DrawTile />
        </CanvasCard>

        {/* Sketch Pad Hint */}
        <div
          className="absolute pointer-events-none flex items-center gap-2 z-10"
          style={{ left: 90 + GAP + 420, top: 320, transform: "rotate(-4deg)" }}
        >
          <ArrowLeft className="w-5 h-5 text-yellow-300 opacity-90 animate-pulse" />
          <p className="text-sm text-yellow-300 font-semibold lowercase tracking-wide">
            type your notes here
          </p>
        </div>

        {/* Bucket list - bottom left */}
        <CanvasCard
          style={{ left: 88 + GAP, top: CY + 352 }}
          rotation={-2}
          className="w-[440px] h-[300px] p-4"
        >
          <BucketListTile />
        </CanvasCard>

        {/* Minigame Tile - top right */}
        <CanvasCard
          style={{ left: CW - 380, top: 180 }}
          rotation={3}
          className="p-3 bg-card border border-border/40 shadow-xl rounded-2xl"
        >
          <MiniGameTile />
        </CanvasCard>

        {/* Fidget Spinner Tile */}
        <CanvasCard
          style={{ left: CX + 1300, top: CY + 300 }}
          rotation={0}
          className="w-64 h-64 p-0 shadow-none bg-transparent border-none"
        >
          <FidgetSpinnerTile />
        </CanvasCard>

        {/* Music vinyl tiles */}

        <CanvasCard
          style={{ left: CW - 382, top: CY + 86 }}
          rotation={4}
          className="overflow-visible bg-transparent border-none shadow-none p-0 z-10"
        >
          <MusicVinylTile
            src="/Music/Tere Liye(KoshalWorld.Com).mp3"
            startTime={42}
            endTime={80}
            coverImage="/Thumbnail/tere liye pic.jpg"
          />
        </CanvasCard>

        <CanvasCard
          style={{ left: CX - 500, top: CY + 200 }}
          rotation={2}
          className="overflow-visible bg-transparent border-none shadow-none p-0 z-10"
        >
          <MusicVinylTile
            src="/Music/Bairan (PenduJatt.Com.Se).mp3"
            startTime={6}
            endTime={36}
            coverImage="/Thumbnail/bairan pic.jpg"
          />
        </CanvasCard>

        <CanvasCard
          style={{ left: 300, top: CY - 34 }}
          rotation={-6}
          className="overflow-visible bg-transparent border-none shadow-none p-0 z-10"
        >
          <MusicVinylTile
            src="/Music/Dhurandhar - Title Track - Dhurandhar (320 kbps).mp3"
            startTime={35}
            endTime={65}
            coverImage="/Thumbnail/dhurandhar pic.jpg"
          />
        </CanvasCard>

        {/* Notes */}
        <CanvasCard style={{ left: CX + 520, top: 140 }} rotation={-6} variant="note" className="w-40">
          <p className="text-xs leading-relaxed">"Ship fast, iterate faster" 🚀</p>
        </CanvasCard>

        <CanvasCard style={{ left: CX + 700, top: CY + 298 }} rotation={4} variant="note" className="w-44">
          <p className="text-xs leading-relaxed">Thanks for exploring! 🙌</p>
        </CanvasCard>
        {/* Stickers */}
        {stickers.map((sticker, i) => (
          <Sticker key={i} {...sticker} />
        ))}

      </DraggableCanvas>
    </>
  );
};

export default Home;
