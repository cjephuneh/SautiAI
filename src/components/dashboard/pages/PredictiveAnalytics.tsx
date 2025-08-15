
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Users,
  DollarSign,
  Phone,
  Calendar,
  Zap,
  Activity,
  Eye,
  Settings,
  RefreshCw,
  Lightbulb
} from "lucide-react";
import { PredictiveAnalyticsService, PaymentPrediction, AnalyticsInsight, PredictionModel } from "@/services/predictiveAnalytics";

export const PredictiveAnalytics = () => {
  const [analyticsService] = useState(() => new PredictiveAnalyticsService());
  const [selectedModel, setSelectedModel] = useState("");
  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
  const [models, setModels] = useState<PredictionModel[]>([]);
  const [predictions, setPredictions] = useState<PaymentPrediction[]>([]);

  useEffect(() => {
    // Load models and generate sample data
    const loadedModels = analyticsService.getModels();
    setModels(loadedModels);
    
    // Generate sample insights
    const sampleInsights = analyticsService.generateInsights([], []);
    setInsights(sampleInsights);

    // Generate sample predictions
    const samplePredictions: PaymentPrediction[] = [
      {
        debtorId: 'debtor_001',
        probability: 0.87,
        confidence: 0.92,
        factors: [
          { name: 'Payment History', impact: 0.3, value: 'Good track record' },
          { name: 'Engagement Level', impact: 0.2, value: 'High responsiveness' },
          { name: 'Debt Age', impact: -0.1, value: '45 days overdue' }
        ],
        recommendedAction: 'High priority - immediate contact recommended',
        timeframe: '7-14 days'
      },
      {
        debtorId: 'debtor_002',
        probability: 0.34,
        confidence: 0.78,
        factors: [
          { name: 'Broken Promises', impact: -0.4, value: '3 broken promises' },
          { name: 'Debt Amount', impact: -0.2, value: '$15,000' },
          { name: 'Call Response', impact: -0.1, value: 'Poor response rate' }
        ],
        recommendedAction: 'Consider settlement offer or write-off evaluation',
        timeframe: '30+ days'
      }
    ];
    setPredictions(samplePredictions);
  }, [analyticsService]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return <TrendingUp className="h-5 w-5" />;
      case 'opportunity': return <Lightbulb className="h-5 w-5" />;
      case 'risk': return <AlertTriangle className="h-5 w-5" />;
      case 'anomaly': return <Activity className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'trend': return 'text-green-600 bg-green-100';
      case 'opportunity': return 'text-blue-600 bg-blue-100';
      case 'risk': return 'text-red-600 bg-red-100';
      case 'anomaly': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Predictive Analytics</h1>
          <p className="text-gray-600">AI-powered insights and predictions for Call Centre optimization</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white shadow-sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Models
          </Button>
          <Button variant="outline" className="bg-white shadow-sm">
            <Settings className="h-4 w-4 mr-2" />
            Model Settings
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
            <Brain className="h-4 w-4 mr-2" />
            Train Models
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Model Accuracy</p>
                <p className="text-2xl font-bold text-blue-600">84.7%</p>
                <p className="text-xs text-gray-500">Payment predictions</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Predictions Today</p>
                <p className="text-2xl font-bold text-green-600">1,247</p>
                <p className="text-xs text-gray-500">+12% vs yesterday</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-violet-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Models</p>
                <p className="text-2xl font-bold text-purple-600">{models.filter(m => m.status === 'active').length}</p>
                <p className="text-xs text-gray-500">of {models.length} total</p>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk Debts</p>
                <p className="text-2xl font-bold text-red-600">23</p>
                <p className="text-xs text-gray-500">Require attention</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                AI-Generated Insights
              </CardTitle>
              <CardDescription>
                Automated analysis and actionable recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight) => (
                  <div key={insight.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getInsightColor(insight.type)}`}>
                          {getInsightIcon(insight.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                          <p className="text-sm text-gray-600">{insight.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact} impact
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm font-medium">{Math.round(insight.confidence * 100)}%</p>
                          <p className="text-xs text-gray-500">confidence</p>
                        </div>
                      </div>
                    </div>
                    
                    {insight.actionRequired && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-2">Recommended Actions:</p>
                        <ul className="text-sm text-blue-800 space-y-1">
                          {insight.recommendedActions.map((action, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Payment Likelihood Predictions
              </CardTitle>
              <CardDescription>
                AI predictions for individual debt payment probability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictions.map((prediction) => (
                  <div key={prediction.debtorId} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">Debtor {prediction.debtorId}</h3>
                        <p className="text-sm text-gray-600">{prediction.recommendedAction}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl font-bold text-gray-900">
                            {Math.round(prediction.probability * 100)}%
                          </span>
                          <Badge variant="outline">
                            {Math.round(prediction.confidence * 100)}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">Expected: {prediction.timeframe}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Payment Probability</span>
                        <span className="text-sm text-gray-600">{Math.round(prediction.probability * 100)}%</span>
                      </div>
                      <Progress 
                        value={prediction.probability * 100} 
                        className={`h-2 ${
                          prediction.probability > 0.7 ? 'bg-green-100' :
                          prediction.probability > 0.4 ? 'bg-yellow-100' : 'bg-red-100'
                        }`}
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Key Factors:</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {prediction.factors.map((factor, index) => (
                          <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{factor.name}</span>
                              <span className={`text-xs ${
                                factor.impact > 0 ? 'text-green-600' : 
                                factor.impact < 0 ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                {factor.impact > 0 ? '+' : ''}{(factor.impact * 100).toFixed(0)}%
                              </span>
                            </div>
                            <p className="text-gray-600 mt-1">{factor.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Prediction Models
              </CardTitle>
              <CardDescription>
                Manage and monitor AI model performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {models.map((model) => (
                  <div key={model.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Brain className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{model.name}</h3>
                          <p className="text-sm text-gray-600">{model.type.replace('_', ' ').toUpperCase()}</p>
                          <p className="text-xs text-gray-500">Last trained: {new Date(model.lastTrained).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">{Math.round(model.accuracy * 100)}%</p>
                          <p className="text-xs text-gray-500">Accuracy</p>
                        </div>
                        
                        <Badge variant={model.status === 'active' ? 'default' : model.status === 'training' ? 'secondary' : 'outline'}>
                          {model.status}
                        </Badge>

                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Optimal Contact Times
                </CardTitle>
                <CardDescription>
                  AI-recommended calling schedules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-green-900">Tuesday 10:00 AM</span>
                      <Badge className="bg-green-100 text-green-800">87% success rate</Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-green-900">Thursday 2:30 PM</span>
                      <Badge className="bg-green-100 text-green-800">84% success rate</Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-yellow-900">Monday 4:00 PM</span>
                      <Badge className="bg-yellow-100 text-yellow-800">72% success rate</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Settlement Recommendations
                </CardTitle>
                <CardDescription>
                  AI-suggested settlement strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">High-Value Accounts</span>
                      <span className="text-sm text-gray-500">25% discount</span>
                    </div>
                    <p className="text-sm text-gray-600">73% acceptance probability</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Aged Debts ({`>180`} days)</span>
                      <span className="text-sm text-gray-500">40% discount</span>
                    </div>
                    <p className="text-sm text-gray-600">68% acceptance probability</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Multiple Broken Promises</span>
                      <span className="text-sm text-gray-500">35% discount</span>
                    </div>
                    <p className="text-sm text-gray-600">61% acceptance probability</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Trends
              </CardTitle>
              <CardDescription>
                Historical analysis and trend predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Trend analysis charts would be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
