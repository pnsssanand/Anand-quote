
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { 
  PenTool, 
  Download, 
  Save, 
  Palette, 
  Type, 
  Image as ImageIcon,
  Square,
  Circle
} from 'lucide-react';

const Editor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [designData, setDesignData] = useState({
    text: 'Your inspirational quote goes here...',
    fontFamily: 'Inter',
    fontSize: 48,
    fontWeight: 'bold',
    textColor: '#ffffff',
    backgroundColor: '#6366f1',
    backgroundType: 'solid',
    gradientStart: '#6366f1',
    gradientEnd: '#8b5cf6',
    textAlign: 'center' as 'left' | 'center' | 'right',
    template: 'social-square'
  });

  const fonts = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Montserrat',
    'Playfair Display', 'Dancing Script', 'Oswald', 'Raleway',
    'Nunito', 'Source Sans Pro', 'Ubuntu', 'Merriweather', 'Lora'
  ];

  const templates = [
    { id: 'social-square', name: 'Social Square', width: 1080, height: 1080 },
    { id: 'instagram-story', name: 'Instagram Story', width: 1080, height: 1920 },
    { id: 'facebook-post', name: 'Facebook Post', width: 1200, height: 630 },
    { id: 'twitter-post', name: 'Twitter Post', width: 1024, height: 512 },
    { id: 'pinterest-pin', name: 'Pinterest Pin', width: 1000, height: 1500 },
    { id: 'tshirt', name: 'T-Shirt', width: 2400, height: 3000 },
    { id: 'mug', name: 'Mug', width: 1800, height: 1200 },
    { id: 'poster', name: 'Poster', width: 2480, height: 3508 }
  ];

  const backgroundColors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
    '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#6366f1',
    '#000000', '#ffffff', '#374151', '#1f2937'
  ];

  const updateDesign = (updates: Partial<typeof designData>) => {
    setDesignData(prev => ({ ...prev, ...updates }));
    renderCanvas({ ...designData, ...updates });
  };

  const renderCanvas = (data: typeof designData) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const template = templates.find(t => t.id === data.template);
    if (!template) return;

    canvas.width = template.width;
    canvas.height = template.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    if (data.backgroundType === 'gradient') {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, data.gradientStart);
      gradient.addColorStop(1, data.gradientEnd);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = data.backgroundColor;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Text
    ctx.fillStyle = data.textColor;
    ctx.font = `${data.fontWeight} ${data.fontSize}px ${data.fontFamily}`;
    ctx.textAlign = data.textAlign;

    const x = data.textAlign === 'center' ? canvas.width / 2 : 
              data.textAlign === 'right' ? canvas.width - 50 : 50;
    const y = canvas.height / 2;

    // Word wrap for long text
    const words = data.text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    const maxWidth = canvas.width - 100;

    for (const word of words) {
      const testLine = currentLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine !== '') {
        lines.push(currentLine);
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);

    const lineHeight = data.fontSize * 1.2;
    const startY = y - (lines.length * lineHeight) / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line.trim(), x, startY + index * lineHeight);
    });
  };

  React.useEffect(() => {
    renderCanvas(designData);
  }, [designData]);

  const downloadImage = (format: 'png' | 'jpeg' | 'pdf') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (format === 'pdf') {
      // For PDF, we'd need a library like jsPDF
      toast({ title: "PDF Download", description: "PDF download feature coming soon!" });
      return;
    }

    const link = document.createElement('a');
    link.download = `quote-design.${format}`;
    link.href = canvas.toDataURL(`image/${format}`, 0.9);
    link.click();

    toast({ title: "Downloaded!", description: `Image saved as ${format.toUpperCase()}` });
  };

  const uploadToCloudinary = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png');
      });

      const formData = new FormData();
      formData.append('file', blob);
      formData.append('upload_preset', 'anand quote generator');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dlvjvskje/image/upload',
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        toast({ title: "Saved!", description: "Design saved to your profile" });
        return data.secure_url;
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save design", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Controls */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PenTool className="w-5 h-5 text-purple-600" />
              <span>Design Controls</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Template Selection */}
            <div className="space-y-2">
              <Label>Template</Label>
              <Select value={designData.template} onValueChange={(value) => updateDesign({ template: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} ({template.width}x{template.height})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Text Content */}
            <div className="space-y-2">
              <Label>Quote Text</Label>
              <Textarea
                value={designData.text}
                onChange={(e) => updateDesign({ text: e.target.value })}
                rows={3}
              />
            </div>

            {/* Font Settings */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select value={designData.fontFamily} onValueChange={(value) => updateDesign({ fontFamily: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fonts.map(font => (
                      <SelectItem key={font} value={font}>{font}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Font Size: {designData.fontSize}px</Label>
                <Slider
                  value={[designData.fontSize]}
                  onValueChange={([value]) => updateDesign({ fontSize: value })}
                  min={24}
                  max={120}
                  step={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Text Alignment</Label>
                <Select value={designData.textAlign} onValueChange={(value: any) => updateDesign({ textAlign: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Text Color</Label>
                <Input
                  type="color"
                  value={designData.textColor}
                  onChange={(e) => updateDesign({ textColor: e.target.value })}
                />
              </div>
            </div>

            {/* Background Settings */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Background Type</Label>
                <Select value={designData.backgroundType} onValueChange={(value) => updateDesign({ backgroundType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid Color</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {designData.backgroundType === 'solid' ? (
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <div className="grid grid-cols-7 gap-2">
                    {backgroundColors.map(color => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded border-2 ${
                          designData.backgroundColor === color ? 'border-gray-400' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => updateDesign({ backgroundColor: color })}
                      />
                    ))}
                  </div>
                  <Input
                    type="color"
                    value={designData.backgroundColor}
                    onChange={(e) => updateDesign({ backgroundColor: e.target.value })}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Gradient Colors</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="color"
                      value={designData.gradientStart}
                      onChange={(e) => updateDesign({ gradientStart: e.target.value })}
                    />
                    <Input
                      type="color"
                      value={designData.gradientEnd}
                      onChange={(e) => updateDesign({ gradientEnd: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="w-5 h-5 text-green-600" />
              <span>Export</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => downloadImage('png')} 
              className="w-full"
              variant="outline"
            >
              Download PNG
            </Button>
            <Button 
              onClick={() => downloadImage('jpeg')} 
              className="w-full"
              variant="outline"
            >
              Download JPEG
            </Button>
            <Button 
              onClick={() => downloadImage('pdf')} 
              className="w-full"
              variant="outline"
            >
              Download PDF
            </Button>
            <Button 
              onClick={uploadToCloudinary} 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save to Profile
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Canvas Preview */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Design Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center min-h-[500px]">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[600px] border shadow-lg"
                style={{ 
                  width: 'auto', 
                  height: 'auto', 
                  maxWidth: '100%', 
                  maxHeight: '600px' 
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Editor;
