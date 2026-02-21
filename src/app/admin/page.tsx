
'use client';

import { MOCK_CLIENTS } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building2, ChevronRight, Mail, PieChart } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-primary">Dashboard Agenzia</h1>
          <p className="text-muted-foreground">Benvenuto, Admin. Ecco la panoramica dei tuoi clienti.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          Aggiungi Cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CLIENTS.map((client) => {
          const usagePercent = (client.post_usati / client.post_totali) * 100;
          return (
            <Card key={client.id} className="group hover:border-accent transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-headline font-semibold">
                  {client.nome_azienda}
                </CardTitle>
                <div className="p-2 bg-muted rounded-full">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Badge variant="secondary" className="font-normal">{client.settore}</Badge>
                </div>
                
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Crediti Post: {client.post_usati} / {client.post_totali}</span>
                    <span className={usagePercent > 80 ? "text-destructive" : ""}>{Math.round(usagePercent)}%</span>
                  </div>
                  <Progress value={usagePercent} className="h-2" />
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                  <Mail className="w-3 h-3" />
                  {client.email_riferimento}
                </div>

                <Button asChild variant="outline" className="w-full mt-4 group-hover:bg-accent group-hover:text-primary-foreground group-hover:border-accent transition-all">
                  <Link href={`/admin/client/${client.id}`}>
                    Dettagli Cliente <ChevronRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
