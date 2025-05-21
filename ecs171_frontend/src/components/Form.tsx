import { useState } from "react";

const Form = () => {
  const [formData, setFormData] = useState({
    age: "",
    capital_gain: "",
    capital_loss: "",
    hours_per_week: "",
    education_num: "",
    workclass: "",
    marital_status: "",
    occupation: "",
    relationship: "",
    sex: "Male",
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

    const parsedData = {
      age: parseInt(formData.age),
      capital_gain: parseInt(formData.capital_gain),
      capital_loss: parseInt(formData.capital_loss),
      hours_per_week: parseInt(formData.hours_per_week),
      education_num: parseInt(formData.education_num),
      workclass: formData.workclass,
      marital_status: formData.marital_status,
      occupation: formData.occupation,
      relationship: formData.relationship,
      sex: formData.sex,
    };

    try {
      const response = await fetch("http://localhost:8000/predict/rf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Server responded with status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Success:", data);
      setResults({
        message: "Success",
        data: {
          age: formData.age,
          occupation: formData.occupation,
          income_chance: data.prediction === ">50K" ? "High" : "Low",
        },
      });
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
            Income Classifier
          </h2>

          <div className="space-y-4">
            {[
              ["Age", "age"],
              ["Capital Gain", "capital_gain"],
              ["Capital Loss", "capital_loss"],
              ["Hours per Week", "hours_per_week"],
              ["Education Num", "education_num"],
              ["Workclass", "workclass"],
              ["Marital Status", "marital_status"],
              ["Occupation", "occupation"],
              ["Relationship", "relationship"],
            ].map(([label, key]) => (
              <div key={key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <input
                  type={["age", "capital_gain", "capital_loss", "hours_per_week", "education_num"].includes(key) ? "number" : "text"}
                  value={formData[key as keyof typeof formData]}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
              </div>
            ))}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Sex
              </label>
              <select
                value={formData.sex}
                onChange={(e) =>
                  setFormData({ ...formData, sex: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
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
            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
              Prediction Result
            </h3>
            <p className="text-center text-lg text-blue-700">
              Chance of income being over $50,000:{" "}
              <span className="font-bold">{results.data.income_chance}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;