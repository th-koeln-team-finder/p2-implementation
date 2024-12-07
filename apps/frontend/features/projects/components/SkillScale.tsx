"use client";

import { useState } from "react";

export default function SkillScale({ title }: { title: string }) {
    const [showAll, setShowAll] = useState(false);

    //TODO Skill Daten übergeben
    const skills = [
        {name: "Java (Programming Language)", level: 4},
        {name: "Python (Programming Language)", level: 3},
        {name: "Teamwork", level: 5},
        {name:"Cooking", level: 2},
        {name: "React", level: 1},
        {name: "German", level: 4},
        {name: "Dancing", level: 3},
        {name: "TypeScript (Programming Language)", level: 3},
    ];

    // Funktion zum Umschalten der Sichtbarkeit
    const toggleShowAll = () => setShowAll(!showAll);

    return (
        <div className="SkillScale w-full">
            <div className="text-2xl font-medium mb-2">{title}</div>
            <div className="flex flex-col">
                <div className="inline-flex mb-2">
                    <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: showAll ? `${skills.length * 32}px` : `${6 * 32}px` }}>
                        {skills.map((skill, index) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: <Array of Skills>
                            <div key={index} className={`w-full self-stretch justify-between inline-flex mb-2 opacity-0 transition-opacity duration-300 ${showAll || index < 6 ? "opacity-100" : ""}`}>
                                <div className="text-base">
                                    {skill.name}
                                </div>
                                <div className="py-px justify-center items-center gap-2.5 flex">
                                    {[...Array(5)].map((_, i) => (
                                        // biome-ignore lint/suspicious/noArrayIndexKey: <Skill Level>
                                        <div key={i} className={`w-2 h-2 rounded-full ${i < skill.level ? "bg-fuchsia-800" : "bg-fuchsia-200"}`}/>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {skills.length > 6 && (
                    <div className="mx-auto inline-flex">
                        {/* biome-ignore lint/a11y/useButtonType: <mehr anzeigen> */}
                        <button onClick={toggleShowAll} className="self-stretch gap-4 inline-flex">
                            <div className="text-fuchsia-700">
                                {showAll ? "Weniger anzeigen" : "Mehr anzeigen"}
                            </div>
                            <div className={`my-auto transform transition-transform ${showAll ? "-rotate-180" : "rotate-0"} duration-300`}>
                                {/* biome-ignore lint/a11y/noSvgWithoutTitle: <svg> */}
                                <svg width="21" height="12" viewBox="0 0 21 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M20.208 0.86652C20.598 1.27152 20.598 1.92652 20.208 2.33052L11.944 10.8935C11.7619 11.0852 11.5426 11.2378 11.2996 11.3421C11.0566 11.4464 10.795 11.5002 10.5305 11.5002C10.2661 11.5002 10.0044 11.4464 9.76142 11.3421C9.51843 11.2378 9.29918 11.0852 9.11702 10.8935L0.792021 2.26852C0.605968 2.07277 0.501394 1.81355 0.499537 1.5435C0.49768 1.27344 0.598678 1.01281 0.782021 0.81452C0.872561 0.716291 0.982302 0.637696 1.10445 0.5836C1.2266 0.529504 1.35855 0.50106 1.49214 0.500029C1.62572 0.498998 1.7581 0.525402 1.88107 0.577605C2.00403 0.629809 2.11497 0.706701 2.20702 0.80352L9.82402 8.69752C9.91511 8.79344 10.0248 8.86982 10.1463 8.92201C10.2678 8.97421 10.3987 9.00112 10.531 9.00112C10.6633 9.00112 10.7942 8.97421 10.9157 8.92201C11.0373 8.86982 11.1469 8.79344 11.238 8.69752L18.795 0.86652C18.886 0.77063 18.9956 0.694268 19.1171 0.642085C19.2385 0.589903 19.3693 0.562992 19.5015 0.562992C19.6337 0.562992 19.7645 0.589903 19.886 0.642085C20.0075 0.694268 20.117 0.77063 20.208 0.86652Z" fill="#A21CAF"/>
                                </svg>
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </div>

    );
}