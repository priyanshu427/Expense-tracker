import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown, DollarSign, Sparkles, CreditCard, CalendarClock, Send } from "lucide-react";
import { MOCK_TRANSACTIONS, MOCK_INSIGHTS } from "@/lib/mockData";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { format, subDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const [isAskOpen, setIsAskOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const totalBalance = MOCK_TRANSACTIONS.reduce((acc, curr) => 
    curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0
  );

  const expenses = MOCK_TRANSACTIONS.filter(t => t.type === 'expense');
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const recurringExpenses = expenses.filter(t => t.isRecurring);
  
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayTransactions = expenses.filter(t => t.date === format(date, 'yyyy-MM-dd'));
    return {
      date: format(date, 'MMM dd'),
      amount: dayTransactions.reduce((acc, curr) => acc + curr.amount, 0)
    };
  });

  const handleAskGemini = () => {
    if (!question.trim()) return;
    setIsThinking(true);
    setAnswer(null);
    
    // Simulate AI delay
    setTimeout(() => {
      setIsThinking(false);
      setAnswer(`Based on your recent transactions, spending on "${question}" has increased by 15% compared to last month. I recommend setting a budget of $200 for this category to stay on track.`);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your financial health.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5" onClick={() => setIsAskOpen(true)}>
            <Sparkles className="w-4 h-4 text-primary" />
            Ask Gemini
          </Button>
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-secondary/50 border border-primary/10 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscriptions" className="gap-2">
            Subscriptions
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] bg-primary/10 text-primary">{recurringExpenses.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="bg-gradient-to-br from-card to-card/50 border-primary/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-mono">${totalBalance.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-500 font-medium">+20.1%</span> from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="bg-gradient-to-br from-card to-card/50 border-primary/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-mono text-destructive">-${totalExpenses.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <span className="text-muted-foreground">+4%</span> from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-24 h-24" />
                </div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-primary">Gemini Insight</CardTitle>
                  <Sparkles className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium leading-relaxed">
                    "{MOCK_INSIGHTS[0].description}"
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts & Transactions */}
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="col-span-4 border-primary/10">
              <CardHeader>
                <CardTitle>Spending Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `$${value}`} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                        itemStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorAmount)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3 border-primary/10">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  You made {MOCK_TRANSACTIONS.length} transactions this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {MOCK_TRANSACTIONS.slice(0, 5).map((txn) => (
                    <div key={txn.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          {txn.type === 'income' ? (
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <CreditCard className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{txn.merchant}</p>
                          <p className="text-xs text-muted-foreground">{txn.category}</p>
                        </div>
                      </div>
                      <div className={cn(
                        "font-mono text-sm font-medium",
                        txn.type === 'income' ? "text-emerald-500" : "text-foreground"
                      )}>
                        {txn.type === 'income' ? '+' : '-'}${txn.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-primary" />
                Active Subscriptions
              </CardTitle>
              <CardDescription>
                Recurring payments detected by Gemini AI.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recurringExpenses.map((sub) => (
                  <motion.div 
                    key={sub.id} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-xl border border-primary/10 bg-secondary/30 hover:bg-secondary/50 transition-colors relative overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/50" />
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center border border-border shadow-sm">
                        <span className="text-lg font-bold text-primary">{sub.merchant[0]}</span>
                      </div>
                      <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">Monthly</Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{sub.merchant}</h3>
                      <p className="text-sm text-muted-foreground">{sub.category}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Next payment: {format(new Date(), 'MMM dd')}</span>
                      <span className="font-mono font-bold text-lg">${sub.amount.toFixed(2)}</span>
                    </div>
                  </motion.div>
                ))}
                {recurringExpenses.length === 0 && (
                  <div className="col-span-full py-12 text-center text-muted-foreground">
                    No subscriptions detected yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Ask Gemini Dialog */}
      <Dialog open={isAskOpen} onOpenChange={setIsAskOpen}>
        <DialogContent className="sm:max-w-[425px] border-primary/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Ask Gemini
            </DialogTitle>
            <DialogDescription>
              Ask questions about your spending habits, budget, or financial goals.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question">Your Question</Label>
              <Textarea 
                id="question" 
                placeholder="e.g., How much did I spend on coffee last month?" 
                className="resize-none focus-visible:ring-primary"
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            
            <AnimatePresence mode="wait">
              {answer && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-sm leading-relaxed"
                >
                  <span className="font-semibold text-primary block mb-1">Gemini:</span>
                  {answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsAskOpen(false)}>Cancel</Button>
            <Button onClick={handleAskGemini} disabled={isThinking || !question.trim()} className="gap-2">
              {isThinking ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Ask Gemini
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
