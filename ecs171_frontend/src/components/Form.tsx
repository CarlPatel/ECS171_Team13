import { useState } from "react";

const Form = () => {
  const [formData, setFormData] = useState({
    age: "",
    occupation: "",
  });

  const [results, setResults] = useState<null | {
    message: string;
    data: {
      age: string;
      occupation: string;
      income_chance: string;
    };
  }>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const age = parseInt(formData.age);
    if (isNaN(age) || age <= 0) {
      setError("Age must be a positive number");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          age: age,
          occupation: formData.occupation,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Server responded with status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Success:", data);
      setResults(data);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-8 space-y-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Enter Information
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="number"
                min="1"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your age"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Occupation
              </label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) =>
                  setFormData({ ...formData, occupation: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your occupation"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-gray-400" : "bg-black hover:bg-black-200"
            } text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        )}

        {results && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="border-t border-b border-gray-200 py-4 mb-4">
              <p className="text-gray-600 mb-1 text-sm">
                Submitted Information:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-2">
                  <p className="font-semibold">Age:</p>
                  <p>{results.data.age}</p>
                  <p className="font-semibold">Occupation:</p>
                  <p>{results.data.occupation}</p>
                  <p className="font-semibold">
                    Chance of Income being over $50,000:
                  </p>
                  <p>{results.data.income_chance}%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;
