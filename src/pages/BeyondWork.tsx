import { motion } from "framer-motion";
import { useAltName } from "@/hooks/use-alt-name";

const topArtists = [
  "Pawan Singh", "KK", "Martin Garrix",
  "Blasterjaxx", "Jass Manak", "Honey Singh",
  "Ajay Hooda", "Atif Aslam"
];


const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const BeyondWork = () => {
  const { isAltName } = useAltName();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="px-5 pt-20 sm:pt-28 pb-32 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <h1 className="text-4xl font-bold font-heading mb-2">
            {isAltName ? "Side Quests" : "Beyond Work"}
          </h1>
        </motion.div>

        <motion.div variants={container} initial="hidden" animate="show" className="space-y-16">

          {/* 1. MORE ABOUT ME */}
          <motion.section variants={item}>
            <h2 className="text-sm font-semibold tracking-wider text-foreground mb-6">
              more about me
            </h2>
            <div className="space-y-4 text-[15px] sm:text-base leading-relaxed text-muted-foreground">
              <p>
                I am Aditya Kumar Verma; I grew up in Singrauli, Madhya Pradesh with a family full of businessmen (they weren’t exactly thrilled when I went the other way).
              </p>
              <p>
                I grew up traveling with my family, and it remains one of the best times of the year for me. I'm really into music.
              </p>
              <p>
                I enjoy travelling, being active, or playing some sports.
              </p>
              <p>
                Recently I've been getting into exploring job opportunities, dialing things in, and obsessing over small details.
              </p>
              <p>
                If any of this overlaps, I would probably enjoy listening music.
              </p>
            </div>
          </motion.section>



          {/* 4. ARTISTS I LISTEN TO */}
          <motion.section variants={item}>
            <h2 className="text-sm font-semibold tracking-wider text-foreground mb-6">
              people i listen to
            </h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 text-[15px] text-muted-foreground">
              {topArtists.map((artist) => (
                <li key={artist}>{artist}</li>
              ))}
            </ul>
          </motion.section>

        </motion.div>
      </main>
    </div>
  );
};

export default BeyondWork;
