import { useState } from "react";

const Compare = () => {
    const [leftPerson, setLeftPerson] = useState({
        fullName: "",
        generation: "",
    });
    const [rightPerson, setRightPerson] = useState({
        fullName: "",
        generation: "",
    });

    const [relationship, setRelationship] = useState("");

    const handleCompare = () => {
        // Logic to determine the relationship
        setRelationship(`${leftPerson.fullName} and ${rightPerson.fullName}`);
    };

    return (
        <div className="flex flex-col items-center px-2 h-full w-full overflow-y-scroll overflow-hidden">
            <h1 className="text-center text-3xl font-bold mt-4 mb-6">Compare</h1>

            {/* Flex Container for Left and Right Person */}
            <div className="flex flex-col lg:flex-row lg:justify-center lg:space-x-8 space-y-8 lg:space-y-0 ">
                {/* Left Person */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-2xl text-gray-500">+</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Enter Full Name"
                        className="px-4 py-2 border rounded w-full lg:w-64"
                        value={leftPerson.fullName}
                        onChange={(e) =>
                            setLeftPerson((prev) => ({ ...prev, fullName: e.target.value }))
                        }
                    />
                    <input
                        type="text"
                        placeholder="Enter Generation"
                        className="px-4 py-2 border rounded w-full lg:w-64"
                        value={leftPerson.generation}
                        onChange={(e) =>
                            setLeftPerson((prev) => ({ ...prev, generation: e.target.value }))
                        }
                    />
                    <button
                        className="bg-purple-700 text-white px-6 py-2 rounded"
                        onClick={handleCompare}
                    >
                        Enter
                    </button>
                </div>

                {/* Right Person */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-2xl text-gray-500">+</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Enter Full Name"
                        className="px-4 py-2 border rounded w-full lg:w-64"
                        value={rightPerson.fullName}
                        onChange={(e) =>
                            setRightPerson((prev) => ({ ...prev, fullName: e.target.value }))
                        }
                    />
                    <input
                        type="text"
                        placeholder="Enter Generation"
                        className="px-4 py-2 border rounded w-full lg:w-64"
                        value={rightPerson.generation}
                        onChange={(e) =>
                            setRightPerson((prev) => ({ ...prev, generation: e.target.value }))
                        }
                    />
                    <button
                        className="bg-purple-700 text-white px-6 py-2 rounded"
                        onClick={handleCompare}
                    >
                        Enter
                    </button>
                </div>
            </div>

            {/* Relationship Result */}
            <div className="text-center w-48 mt-8 flex flex-col mb-4">
                Dummy Text Result
                {relationship && (
                    <p className="text-lg font-bold">{relationship}</p>
                )}
                <button
                    className="bg-green-600 text-white px-6 py-2 rounded mt-4"
                    onClick={() => alert("Generate Family Tree!")}
                >
                    Generate Family Tree
                </button>
            </div>
        </div>
    );
};

export default Compare;
