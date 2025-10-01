import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiConfig } from '@/config/api';
import { Globe, Home, Server } from 'lucide-react';

const EnvironmentSwitcher: React.FC = () => {
  const handleEnvironmentChange = (env: string) => {
    // This would typically reload the page with new environment
    // For now, just show the current configuration
    console.log(`Switching to ${env} environment`);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Environment Configuration
        </CardTitle>
        <CardDescription>
          Current API configuration and environment settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Environment:</span>
            <Badge variant={apiConfig.isDevelopment ? "default" : "secondary"}>
              {apiConfig.isDevelopment ? "Development" : "Production"}
            </Badge>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">API URL:</span>
            </div>
            <code className="text-xs bg-gray-100 p-1 rounded block break-all">
              {apiConfig.baseUrl}
            </code>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Playground URL:</span>
            </div>
            <code className="text-xs bg-gray-100 p-1 rounded block break-all">
              {apiConfig.playgroundUrl}
            </code>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500">
            To change environment, use the appropriate npm script:
            <br />
            • <code>npm run dev:local</code> - Local development
            <br />
            • <code>npm run dev:staging</code> - Staging environment
            <br />
            • <code>npm run build:production</code> - Production build
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnvironmentSwitcher;