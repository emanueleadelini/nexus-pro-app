
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Users, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white via-background to-accent/10">
      <div className="max-w-4xl w-full text-center space-y-8 mb-12">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary tracking-tight">
            Nexus <span className="text-accent">Agency</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
            La piattaforma integrata per la gestione collaborativa del tuo calendario editoriale e dei tuoi asset digitali.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        <Card className="hover:shadow-xl transition-shadow border-t-4 border-t-primary">
          <CardHeader>
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl">Area Agency (Admin)</CardTitle>
            <CardDescription>Gestisci clienti, approva post e valida materiali caricati.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full h-12 text-lg">
              <Link href="/admin">
                Accedi come Admin <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-xl transition-shadow border-t-4 border-t-accent">
          <CardHeader>
            <div className="bg-accent/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <CardTitle className="font-headline text-2xl">Area Cliente</CardTitle>
            <CardDescription>Approva i tuoi post, carica materiali e visualizza i tuoi crediti.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild variant="outline" className="w-full h-12 text-lg border-accent text-accent hover:bg-accent/5">
              <Link href="/client">
                Accedi come Cliente <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
