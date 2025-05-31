
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Download, Edit, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Quotes = () => {
  // Placeholder data - in real app, this would come from Firestore
  const savedQuotes = [
    {
      id: '1',
      text: 'The path to success begins with a single step of courage.',
      category: 'Motivation',
      mood: 'Inspiring',
      createdAt: new Date('2024-01-15'),
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'
    },
    {
      id: '2',
      text: 'In every thoughtful moment, we find the strength to grow.',
      category: 'Life',
      mood: 'Thoughtful',
      createdAt: new Date('2024-01-14'),
      imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400'
    },
    {
      id: '3',
      text: 'Success is the result of preparation meeting opportunity.',
      category: 'Business',
      mood: 'Empowering',
      createdAt: new Date('2024-01-13'),
      imageUrl: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400'
    }
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            My Quotes
          </h1>
          <p className="text-gray-600 mt-2">
            View and manage your saved quotes and designs
          </p>
        </div>
        <Link to="/generate">
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Generate New Quote
          </Button>
        </Link>
      </div>

      {savedQuotes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved quotes yet</h3>
            <p className="text-gray-600 mb-6">
              Start generating quotes to see them appear here
            </p>
            <Link to="/generate">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Generate Your First Quote
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedQuotes.map((quote) => (
            <Card key={quote.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              {quote.imageUrl && (
                <div className="aspect-square bg-gradient-to-r from-purple-500 to-blue-500 relative">
                  <img 
                    src={quote.imageUrl} 
                    alt="Quote background"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <p className="text-white text-lg font-semibold text-center leading-relaxed">
                      "{quote.text}"
                    </p>
                  </div>
                </div>
              )}
              
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {!quote.imageUrl && (
                      <p className="text-gray-800 font-medium mb-3 leading-relaxed">
                        "{quote.text}"
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        {quote.category}
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {quote.mood}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Created {formatDate(quote.createdAt)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex space-x-2">
                  <Link to="/editor" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Statistics */}
      {savedQuotes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quote Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{savedQuotes.length}</div>
                <p className="text-sm text-gray-600">Total Quotes</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {new Set(savedQuotes.map(q => q.category)).size}
                </div>
                <p className="text-sm text-gray-600">Categories Used</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {savedQuotes.filter(q => q.imageUrl).length}
                </div>
                <p className="text-sm text-gray-600">With Designs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Quotes;
