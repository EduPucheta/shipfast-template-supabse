"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSpace } from "@/app/context/SpaceContext";
import { toast } from "react-hot-toast";

const supabase = createClientComponentClient();

const CreateABTest = () => {
    const { selectedSpace } = useSpace();

    const [testName, setTestName] = useState("");
    const [testDescription, setTestDescription] = useState("");
    const [targetUrl, setTargetUrl] = useState("");
    const [testElementSelector, setTestElementSelector] = useState(""); // Selector for the element to modify
    const [goalType, setGoalType] = useState("click"); // 'click', 'pageview'
    const [goalSelector, setGoalSelector] = useState(""); // Selector for the goal (if click)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [selectedDevices, setSelectedDevices] = useState({
        desktop: true,
        tablet: true,
        mobile: true
    });

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data, error: authError } = await supabase.auth.getUser();
                if (authError) throw authError;
                setUserId(data.user?.id || null);
            } catch (authError) {
                setError("Could not fetch user information: " + authError.message);
                console.error("Authentication Error:", authError);
            }
        };

        getUser();
    }, []);

    const handleCreateABTest = async () => {
        setError(null);

        if (!userId) {
            setError("User information not available. Please refresh or log in again.");
            return;
        }
        if (!selectedSpace) {
            setError("No space selected. Please select or create a space first.");
            return;
        }
        if (!testName.trim()) {
            setError("Test name is required.");
            document.getElementById('test-name-input')?.focus();
            return;
        }
        if (!targetUrl.trim()) {
            setError("Target URL is required.");
            document.getElementById('target-url-input')?.focus();
            return;
        }
        if (!testElementSelector.trim()) {
            setError("Element selector is required.");
            document.getElementById('test-element-selector-input')?.focus();
            return;
        }

        if (!selectedDevices.desktop && !selectedDevices.tablet && !selectedDevices.mobile) {
            setError("Please select at least one device type.");
            return;
        }

        setLoading(true);

        // Mock submission for now
        console.log("Creating A/B Test:", {
            testName,
            testDescription,
            targetUrl,
            testElementSelector,
            goalType,
            goalSelector,
            selectedDevices,
            userId,
            spaceId: selectedSpace.id
        });

        setTimeout(() => {
            setLoading(false);
            toast.success(`A/B Test "${testName}" created successfully!`);
            // Reset form
            setTestName("");
            setTestDescription("");
            setTargetUrl("");
            setTestElementSelector("");
            setGoalSelector("");
        }, 1000);
    };

    return (
        <div className="card bg-base-100 w-full max-w-3xl mx-auto">
            <div className="card-body pt-0">
                <h2 className="card-title text-xl justify-center mb-6">Create new A/B Test</h2>

                {error && (
                    <div role="alert" className="alert alert-error mb-4 shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span><strong>Error:</strong> {error}</span>
                    </div>
                )}

                <div className="space-y-3">
                    {/* Section 1: Information */}
                    <div className="collapse collapse-arrow bg-base-200 rounded-box shadow-sm">
                        <input type="checkbox" className="peer" defaultChecked />
                        <div className="collapse-title text-lg font-medium peer-checked:bg-base-300 peer-checked:text-base-content">
                            Information
                        </div>
                        <div className="collapse-content bg-base-100 text-base-content peer-checked:bg-base-100">
                            <div className="pt-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Name (Internal)</span>
                                    </label>
                                    <input
                                        id="test-name-input"
                                        type="text"
                                        placeholder="e.g., Homepage Hero Test"
                                        className="input input-bordered w-full"
                                        value={testName}
                                        onChange={(e) => setTestName(e.target.value)}
                                    />
                                </div>
                                <div className="form-control mt-3">
                                    <label className="label">
                                        <span className="label-text">Description (Internal, Optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Briefly describe the test's purpose"
                                        className="input input-bordered w-full"
                                        value={testDescription}
                                        onChange={(e) => setTestDescription(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Targeting */}
                    <div className="collapse collapse-arrow bg-base-200 rounded-box shadow-sm">
                        <input type="checkbox" className="peer" defaultChecked />
                        <div className="collapse-title text-lg font-medium peer-checked:bg-base-300 peer-checked:text-base-content">
                            Targeting
                        </div>
                        <div className="collapse-content bg-base-100 text-base-content peer-checked:bg-base-100">
                            <div className="pt-4 space-y-6">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Target URL <span className="text-error">*</span></span>
                                    </label>
                                    <input
                                        id="target-url-input"
                                        type="text"
                                        placeholder="https://example.com/pricing"
                                        className="input input-bordered w-full"
                                        value={targetUrl}
                                        onChange={(e) => setTargetUrl(e.target.value)}
                                        required
                                    />
                                    <label className="label">
                                        <span className="label-text-alt">The page where the test will run.</span>
                                    </label>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Element Selector (CSS) <span className="text-error">*</span></span>
                                    </label>
                                    <input
                                        id="test-element-selector-input"
                                        type="text"
                                        placeholder=".hero-title, #main-cta"
                                        className="input input-bordered w-full"
                                        value={testElementSelector}
                                        onChange={(e) => setTestElementSelector(e.target.value)}
                                        required
                                    />
                                    <label className="label">
                                        <span className="label-text-alt">The CSS selector of the element you want to modify in this test.</span>
                                    </label>
                                </div>

                                {/* Devices Selection */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Devices <span className="text-error">*</span></span>
                                    </label>
                                    <p className="text-sm text-base-content/70 mb-2">Select which devices to show this test on</p>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="checkbox"
                                                checked={selectedDevices.desktop}
                                                onChange={(e) => setSelectedDevices(prev => ({ ...prev, desktop: e.target.checked }))}
                                            />
                                            <span className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="2" y="3" width="20" height="14" rx="2" />
                                                    <line x1="8" y1="21" x2="16" y2="21" />
                                                    <line x1="12" y1="17" x2="12" y2="21" />
                                                </svg>
                                                Desktop
                                            </span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="checkbox"
                                                checked={selectedDevices.tablet}
                                                onChange={(e) => setSelectedDevices(prev => ({ ...prev, tablet: e.target.checked }))}
                                            />
                                            <span className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="4" y="2" width="16" height="20" rx="2" />
                                                    <line x1="12" y1="18" x2="12" y2="18" />
                                                </svg>
                                                Tablet
                                            </span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="checkbox"
                                                checked={selectedDevices.mobile}
                                                onChange={(e) => setSelectedDevices(prev => ({ ...prev, mobile: e.target.checked }))}
                                            />
                                            <span className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="5" y="2" width="14" height="20" rx="2" />
                                                    <line x1="12" y1="18" x2="12" y2="18" />
                                                </svg>
                                                Mobile
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Goal */}
                    <div className="collapse collapse-arrow bg-base-200 rounded-box shadow-sm">
                        <input type="checkbox" className="peer" defaultChecked />
                        <div className="collapse-title text-lg font-medium peer-checked:bg-base-300 peer-checked:text-base-content">
                            Goal
                        </div>
                        <div className="collapse-content bg-base-100 text-base-content peer-checked:bg-base-100">
                            <div className="pt-4 space-y-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Goal Type</span>
                                    </label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={goalType}
                                        onChange={(e) => setGoalType(e.target.value)}
                                    >
                                        <option value="click">Click on Element</option>
                                        <option value="pageview">Page View</option>
                                    </select>
                                </div>

                                {goalType === 'click' && (
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Click Element Selector (CSS)</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder=".signup-button, #cta-hero"
                                            className="input input-bordered w-full"
                                            value={goalSelector}
                                            onChange={(e) => setGoalSelector(e.target.value)}
                                        />
                                        <label className="label">
                                            <span className="label-text-alt">CSS selector of the element to track clicks on.</span>
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submission Button */}
                <div className="card-actions justify-end mt-6">
                    <button
                        className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`}
                        onClick={handleCreateABTest}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                Creating...
                            </>
                        ) : "Create A/B Test"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateABTest;
