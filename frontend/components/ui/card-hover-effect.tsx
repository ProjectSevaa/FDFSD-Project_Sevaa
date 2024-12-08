import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Card, CardTitle, CardDescription, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <Link
          href={item?.link}
          key={item?.link}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Entire Card Content with Hover Effect */}
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.div
                className="absolute inset-0 bg-neutral-200 dark:bg-slate-800/[0.8] rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>

          {/* Full Card Content */}
          <Card className="relative z-10 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{item.title}</span>
                <Badge variant="default">Open</Badge> {/* Example Badge */}
              </CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-2">
              {/* You can display more information here */}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available Food</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {/* Example of available food */}
                  <Badge variant="outline">Rice</Badge>
                  <Badge variant="outline">Curry</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Posted {new Date().toLocaleDateString()}</p>
            </CardContent>

            <CardFooter className="mt-auto">
              <Button className="w-fit">Send Request</Button>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
};
