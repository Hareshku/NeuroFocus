import React, { useState, useEffect } from "react";
import {
  Brain,
  Heart,
  Activity,
  Zap,
  MessageCircle,
  Settings,
  AlertTriangle,
  TrendingUp,
  Eye,
  Mic,
  Volume2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Cell,
} from "recharts";

const BrainComputerInterface = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isConnected, setIsConnected] = useState(true);
  const [currentState, setCurrentState] = useState("focused");
  const [aiResponse, setAiResponse] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // Mock real-time data
  const [biometricData, setBiometricData] = useState({
    eeg: { alpha: 65, beta: 78, theta: 45, delta: 32 },
    heartRate: 72,
    stress: 25,
    focus: 82,
    fatigue: 15,
  });

  const [timeSeriesData, setTimeSeriesData] = useState([
    { time: "10:00", focus: 75, stress: 20, heartRate: 70 },
    { time: "10:05", focus: 80, stress: 15, heartRate: 72 },
    { time: "10:10", focus: 85, stress: 18, heartRate: 74 },
    { time: "10:15", focus: 78, stress: 25, heartRate: 76 },
    { time: "10:20", focus: 82, stress: 22, heartRate: 72 },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBiometricData((prev) => ({
        eeg: {
          alpha: Math.max(
            0,
            Math.min(100, prev.eeg.alpha + (Math.random() - 0.5) * 10)
          ),
          beta: Math.max(
            0,
            Math.min(100, prev.eeg.beta + (Math.random() - 0.5) * 10)
          ),
          theta: Math.max(
            0,
            Math.min(100, prev.eeg.theta + (Math.random() - 0.5) * 10)
          ),
          delta: Math.max(
            0,
            Math.min(100, prev.eeg.delta + (Math.random() - 0.5) * 10)
          ),
        },
        heartRate: Math.max(
          60,
          Math.min(100, prev.heartRate + (Math.random() - 0.5) * 4)
        ),
        stress: Math.max(
          0,
          Math.min(100, prev.stress + (Math.random() - 0.5) * 8)
        ),
        focus: Math.max(
          0,
          Math.min(100, prev.focus + (Math.random() - 0.5) * 6)
        ),
        fatigue: Math.max(
          0,
          Math.min(100, prev.fatigue + (Math.random() - 0.5) * 5)
        ),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // AI Agent responses based on biometric data
  useEffect(() => {
    const generateAIResponse = () => {
      const { stress, focus, fatigue } = biometricData;

      if (stress > 60) {
        setAiResponse(
          "I notice your stress levels are elevated. Would you like me to guide you through a breathing exercise?"
        );
        setCurrentState("stressed");
      } else if (fatigue > 70) {
        setAiResponse(
          "You seem fatigued. Consider taking a short break or adjusting your task complexity."
        );
        setCurrentState("tired");
      } else if (focus > 80) {
        setAiResponse(
          "Great focus! You're in an optimal state for complex tasks."
        );
        setCurrentState("focused");
      } else if (focus < 40) {
        setAiResponse(
          "Your attention seems scattered. Let me adjust the interface to reduce distractions."
        );
        setCurrentState("distracted");
      }
    };

    const timer = setTimeout(generateAIResponse, 1000);
    return () => clearTimeout(timer);
  }, [biometricData]);

  const MetricCard = ({ title, value, unit, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        {trend && (
          <div
            className={`flex items-center text-sm ${
              trend > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">
        {value}
        <span className="text-lg text-gray-500 ml-1">{unit}</span>
      </p>
    </div>
  );

  const BrainWaveVisualization = ({ data }) => {
    const waveData = [
      { name: "Alpha", value: data.alpha, color: "#8B5CF6" },
      { name: "Beta", value: data.beta, color: "#06B6D4" },
      { name: "Theta", value: data.theta, color: "#10B981" },
      { name: "Delta", value: data.delta, color: "#F59E0B" },
    ];

    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-purple-600" />
          EEG Brain Waves
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="20%"
            outerRadius="90%"
            data={waveData}
          >
            <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8">
              {waveData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </RadialBar>
            <Tooltip />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {waveData.map((wave, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-2`}
                style={{ backgroundColor: wave.color }}
              ></div>
              <span className="text-sm text-gray-600">
                {wave.name}: {wave.value}Hz
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const AIAssistant = () => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 shadow-lg border border-blue-200">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div className="ml-3">
          <h3 className="font-semibold text-gray-900">AI Assistant</h3>
          <p className="text-sm text-gray-600">Neural State: {currentState}</p>
        </div>
        <div className="ml-auto flex space-x-2">
          <button className="p-2 hover:bg-blue-200 rounded-lg transition-colors">
            <Mic className="w-4 h-4 text-blue-600" />
          </button>
          <button className="p-2 hover:bg-blue-200 rounded-lg transition-colors">
            <Volume2 className="w-4 h-4 text-blue-600" />
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg p-4 mb-4">
        <p className="text-gray-800">{aiResponse}</p>
      </div>
      <div className="flex space-x-2">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex-1">
          Accept Suggestion
        </button>
        <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
          Modify
        </button>
      </div>
    </div>
  );

  const ConnectionStatus = () => (
    <div
      className={`flex items-center px-4 py-2 rounded-lg ${
        isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full mr-2 ${
          isConnected ? "bg-green-600" : "bg-red-600"
        }`}
      ></div>
      <span className="text-sm font-medium">
        {isConnected ? "BCI Connected" : "BCI Disconnected"}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Brain className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">NeuroLink BCI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ConnectionStatus />
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "dashboard", label: "Dashboard", icon: Activity },
              { id: "signals", label: "Neural Signals", icon: Zap },
              { id: "chat", label: "AI Chat", icon: MessageCircle },
              { id: "training", label: "Training", icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Focus Level"
                value={Math.round(biometricData.focus)}
                unit="%"
                icon={Eye}
                color="blue"
                trend={2.3}
              />
              <MetricCard
                title="Stress Level"
                value={Math.round(biometricData.stress)}
                unit="%"
                icon={AlertTriangle}
                color="red"
                trend={-1.5}
              />
              <MetricCard
                title="Heart Rate"
                value={Math.round(biometricData.heartRate)}
                unit="BPM"
                icon={Heart}
                color="pink"
                trend={0.8}
              />
              <MetricCard
                title="Fatigue Level"
                value={Math.round(biometricData.fatigue)}
                unit="%"
                icon={Activity}
                color="orange"
                trend={-3.2}
              />
            </div>

            {/* Charts and AI Assistant */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <BrainWaveVisualization data={biometricData.eeg} />
              </div>
              <div>
                <AIAssistant />
              </div>
            </div>

            {/* Time Series Chart */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Biometric Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="focus"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    name="Focus"
                  />
                  <Line
                    type="monotone"
                    dataKey="stress"
                    stroke="#EF4444"
                    strokeWidth={2}
                    name="Stress"
                  />
                  <Line
                    type="monotone"
                    dataKey="heartRate"
                    stroke="#EC4899"
                    strokeWidth={2}
                    name="Heart Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "signals" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Neural Signal Analysis
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BrainWaveVisualization data={biometricData.eeg} />
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Signal Quality
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          EEG Electrodes
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          98% Connected
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Signal Noise
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          Low
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Impedance</span>
                        <span className="text-sm font-medium text-yellow-600">
                          Moderate
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "chat" && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 h-96">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                AI Assistant Chat
              </h2>
              <p className="text-sm text-gray-600">
                Powered by empathetic LLM with BCI integration
              </p>
            </div>
            <div className="p-6 h-64 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-blue-100 rounded-lg p-3 max-w-md">
                    <p className="text-sm">{aiResponse}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "training" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                BCI Training Protocols
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Motor Imagery
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Train your brain to control cursors through imagination
                  </p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Start Training
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Attention Training
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Improve focus and concentration through neurofeedback
                  </p>
                  <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Start Training
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Relaxation
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Learn to control stress and achieve calm states
                  </p>
                  <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Start Training
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BrainComputerInterface;
