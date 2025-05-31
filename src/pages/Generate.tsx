
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/hooks/use-toast';
import { Sparkles, Copy, Download, Edit, RefreshCw } from 'lucide-react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const Generate = () => {
  const { userProfile, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    category: '',
    mood: '',
    keyword: '',
    language: 'English',
    lengthRange: [8]
  });

  const categories = [
    'Motivation', 'Love', 'Success', 'Friendship', 'Life', 'Business', 
    'Leadership', 'Creativity', 'Mindfulness', 'Adventure', 'Health', 'Education'
  ];

  const moods = [
    'Inspiring', 'Thoughtful', 'Humorous', 'Romantic', 'Empowering', 
    'Calming', 'Energetic', 'Philosophical', 'Uplifting', 'Reflective'
  ];

  const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese'];

  const generateQuotes = async () => {
    if (!formData.category || !formData.mood) {
      toast({ title: "Error", description: "Please select category and mood", variant: "destructive" });
      return;
    }

    if (!userProfile?.credits || userProfile.credits < 1) {
      toast({ title: "No Credits", description: "You need credits to generate quotes", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Simulate AI quote generation
      const generatedQuotes = await simulateQuoteGeneration(formData);
      setQuotes(generatedQuotes);
      
      // Deduct credit
      await updateUserProfile({ credits: userProfile.credits - 1 });
      
      toast({ title: "Success!", description: `Generated ${generatedQuotes.length} quotes` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate quotes", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const simulateQuoteGeneration = async (data: any): Promise<string[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const templates = [
      `The path to ${data.keyword || 'success'} begins with a single step of courage.`,
      `In every ${data.mood.toLowerCase()} moment, we find the strength to grow.`,
      `${data.category} is not about perfection, it's about progress.`,
      `Today's ${data.keyword || 'challenges'} are tomorrow's achievements.`,
      `Embrace the ${data.mood.toLowerCase()} energy within you.`,
      `Great ${data.category.toLowerCase()} starts with believing in yourself.`,
      `Every sunrise brings new opportunities for ${data.keyword || 'growth'}.`,
      `The magic happens when you step outside your comfort zone.`,
      `Your ${data.mood.toLowerCase()} spirit is your greatest asset.`,
      `Transform your dreams into reality, one day at a time.`,
      `Success is the result of preparation meeting opportunity.`,
      `Life rewards those who dare to be different.`
    ];

    return templates.slice(0, Math.floor(Math.random() * 4) + 8);
  };

  const copyQuote = (quote: string) => {
    navigator.clipboard.writeText(quote);
    toast({ title: "Copied!", description: "Quote copied to clipboard" });
  };

  const downloadQuotes = () => {
    const content = quotes.join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-quotes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          AI Quote Generator
        </h1>
        <p className="text-gray-600">
          Generate unique, inspiring quotes powered by AI
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>Generate New Quotes</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mood">Mood *</Label>
              <Select value={formData.mood} onValueChange={(value) => setFormData({...formData, mood: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  {moods.map(mood => (
                    <SelectItem key={mood} value={mood}>{mood}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyword">Optional Keyword</Label>
              <Input
                placeholder="e.g., dreams, success, love"
                value={formData.keyword}
                onChange={(e) => setFormData({...formData, keyword: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Quote Length: {formData.lengthRange[0]} words</Label>
            <Slider
              value={formData.lengthRange}
              onValueChange={(value) => setFormData({...formData, lengthRange: value})}
              max={16}
              min={4}
              step={1}
              className="w-full"
            />
          </div>

          <Button 
            onClick={generateQuotes} 
            disabled={loading || !userProfile?.credits}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            size="lg"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            {loading ? 'Generating...' : `Generate Quotes (1 Credit)`}
          </Button>
        </CardContent>
      </Card>

      {quotes.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Generated Quotes ({quotes.length})</CardTitle>
            <Button variant="outline" onClick={downloadQuotes}>
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {quotes.map((quote, index) => (
                <div key={index} className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border">
                  <p className="text-gray-800 mb-3 text-lg leading-relaxed">"{quote}"</p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => copyQuote(quote)}>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Generate;
