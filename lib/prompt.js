"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAskUserPrompt = exports.buildAskSystemPrompt = exports.buildObserveUserMessage = exports.buildObserveSystemPrompt = exports.buildMetadataPrompt = exports.buildMetadataSystemPrompt = exports.buildRefineUserPrompt = exports.buildRefineSystemPrompt = exports.buildExtractUserPrompt = exports.buildExtractSystemPrompt = exports.actTools = exports.buildActUserPrompt = exports.buildActSystemPrompt = exports.buildVerifyActCompletionUserPrompt = exports.buildVerifyActCompletionSystemPrompt = void 0;
// act
var actSystemPrompt = "\n# Instructions\nYou are a browser automation assistant. Your job is to accomplish the user's goal across multiple model calls by running playwright commands.\n\n## Input\nYou will receive:\n1. the user's overall goal\n2. the steps that you've taken so far\n3. a list of active DOM elements in this chunk to consider to get closer to the goal. \n4. Optionally, a list of variable names that the user has provided that you may use to accomplish the goal. To use the variables, you must use the special <|VARIABLE_NAME|> syntax.\n\n\n## Your Goal / Specification\nYou have 2 tools that you can call: doAction, and skipSection. Do action only performs Playwright actions. Do exactly what the user's goal is. Do not perform any other actions or exceed the scope of the goal.\nIf the user's goal will be accomplished after running the playwright action, set completed to true. Better to have completed set to true if your are not sure.\n\nNote 1: If there is a popup on the page for cookies or advertising that has nothing to do with the goal, try to close it first before proceeding. As this can block the goal from being completed.\nNote 2: Sometimes what your are looking for is hidden behind and element you need to interact with. For example, sliders, buttons, etc...\n\nAgain, if the user's goal will be accomplished after running the playwright action, set completed to true.\n";
var verifyActCompletionSystemPrompt = "\nYou are a browser automation assistant. The job has given you a goal and a list of steps that have been taken so far. Your job is to determine if the user's goal has been completed based on the provided information.\n\n# Input\nYou will receive:\n1. The user's goal: A clear description of what the user wants to achieve.\n2. Steps taken so far: A list of actions that have been performed up to this point.\n3. An image of the current page\n\n# Your Task\nAnalyze the provided information to determine if the user's goal has been fully completed.\n\n# Output\nReturn a boolean value:\n- true: If the goal has been definitively completed based on the steps taken and the current page.\n- false: If the goal has not been completed or if there's any uncertainty about its completion.\n\n# Important Considerations\n- False positives are okay. False negatives are not okay.\n- Look for evidence of errors on the page or something having gone wrong in completing the goal. If one does not exist, return true.\n";
// ## Examples for completion check
// ### Example 1
// 1. User's goal: "input data scientist into role"
// 2. Steps you've taken so far: "The role input field was filled with 'data scientist'."
// 3. Active DOM elements: ["<input id="c9" class="VfPpkd-fmcmS-wGMbrd " aria-expanded="false" data-axe="mdc-autocomplete">data scientist</input>", "<button class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-INsAgc lJ9FBc nDgy9d" type="submit">Search</button>"]
// Output: Will need to have completed set to true. Nothing else matters.
// Reasoning: The goal the user set has already been accomplished. We should not take any extra actions outside of the scope of the goal (for example, clicking on the search button is an invalid action - ie: not acceptable).
// ### Example 2
// 1. User's goal: "Sign up for the newsletter"
// 2. Steps you've taken so far: ["The email input field was filled with 'test@test.com'."]
// 3. Active DOM elements: ["<input type='email' id='newsletter-email' placeholder='Enter your email'></input>", "<button id='subscribe-button'>Subscribe</button>"]
// Output: Will need to have click on the subscribe button as action. And completed set to false.
// Reasoning: There might be an error when trying to submit the form and you need to make sure the goal is accomplished properly. So you set completed to false.
function buildVerifyActCompletionSystemPrompt() {
    return {
        role: "system",
        content: verifyActCompletionSystemPrompt,
    };
}
exports.buildVerifyActCompletionSystemPrompt = buildVerifyActCompletionSystemPrompt;
function buildVerifyActCompletionUserPrompt(goal, steps, domElements) {
    if (steps === void 0) { steps = "None"; }
    var actUserPrompt = "\n# My Goal\n".concat(goal, "\n\n# Steps You've Taken So Far\n").concat(steps, "\n");
    if (domElements) {
        actUserPrompt += "\n# Active DOM Elements on the current page\n".concat(domElements, "\n");
    }
    return {
        role: "user",
        content: actUserPrompt,
    };
}
exports.buildVerifyActCompletionUserPrompt = buildVerifyActCompletionUserPrompt;
function buildActSystemPrompt() {
    return {
        role: "system",
        content: actSystemPrompt,
    };
}
exports.buildActSystemPrompt = buildActSystemPrompt;
function buildActUserPrompt(action, steps, domElements, variables) {
    if (steps === void 0) { steps = "None"; }
    var actUserPrompt = "\n# My Goal\n".concat(action, "\n\n# Steps You've Taken So Far\n").concat(steps, "\n\n# Current Active Dom Elements\n").concat(domElements, "\n");
    if (variables && Object.keys(variables).length > 0) {
        actUserPrompt += "\n# Variables\n".concat(Object.keys(variables)
            .map(function (key) { return "<|".concat(key.toUpperCase(), "|>"); })
            .join("\n"), "\n");
    }
    return {
        role: "user",
        content: actUserPrompt,
    };
}
exports.buildActUserPrompt = buildActUserPrompt;
exports.actTools = [
    {
        type: "function",
        function: {
            name: "doAction",
            description: "execute the next playwright step that directly accomplishes the goal",
            parameters: {
                type: "object",
                required: ["method", "element", "args", "step", "completed"],
                properties: {
                    method: {
                        type: "string",
                        description: "The playwright function to call.",
                    },
                    element: {
                        type: "number",
                        description: "The element number to act on",
                    },
                    args: {
                        type: "array",
                        description: "The required arguments",
                        items: {
                            type: "string",
                            description: "The argument to pass to the function",
                        },
                    },
                    step: {
                        type: "string",
                        description: "human readable description of the step that is taken in the past tense. Please be very detailed.",
                    },
                    why: {
                        type: "string",
                        description: "why is this step taken? how does it advance the goal?",
                    },
                    completed: {
                        type: "boolean",
                        description: "true if the goal should be accomplished after this step",
                    },
                },
            },
        },
    },
    {
        type: "function",
        function: {
            name: "skipSection",
            description: "skips this area of the webpage because the current goal cannot be accomplished here",
            parameters: {
                type: "object",
                properties: {
                    reason: {
                        type: "string",
                        description: "reason that no action is taken",
                    },
                },
            },
        },
    },
];
// extract
function buildExtractSystemPrompt(isUsingPrintExtractedDataTool, useTextExtract) {
    if (isUsingPrintExtractedDataTool === void 0) { isUsingPrintExtractedDataTool = false; }
    if (useTextExtract === void 0) { useTextExtract = true; }
    var baseContent = "You are extracting content on behalf of a user.\n  If a user asks you to extract a 'list' of information, or 'all' information, \n  YOU MUST EXTRACT ALL OF THE INFORMATION THAT THE USER REQUESTS.\n   \n  You will be given:\n1. An instruction\n2. ";
    var contentDetail = useTextExtract
        ? "A text representation of a webpage to extract information from."
        : "A list of DOM elements to extract from.";
    var instructions = "\nPrint the exact text from the ".concat(useTextExtract ? "text-rendered webpage" : "DOM elements", " with all symbols, characters, and endlines as is.\nPrint null or an empty string if no new information is found.\n  ").trim();
    var toolInstructions = isUsingPrintExtractedDataTool
        ? "\nONLY print the content using the print_extracted_data tool provided.\nONLY print the content using the print_extracted_data tool provided.\n  ".trim()
        : "";
    var additionalInstructions = useTextExtract
        ? "Once you are given the text-rendered webpage, \n    you must thoroughly and meticulously analyze it. Be very careful to ensure that you\n    do not miss any important information."
        : "";
    var content = "".concat(baseContent).concat(contentDetail, "\n\n").concat(instructions, "\n").concat(toolInstructions).concat(additionalInstructions ? "\n\n".concat(additionalInstructions) : "").replace(/\s+/g, " ");
    return {
        role: "system",
        content: content,
    };
}
exports.buildExtractSystemPrompt = buildExtractSystemPrompt;
function buildExtractUserPrompt(instruction, domElements, isUsingPrintExtractedDataTool) {
    if (isUsingPrintExtractedDataTool === void 0) { isUsingPrintExtractedDataTool = false; }
    var content = "Instruction: ".concat(instruction, "\nDOM: ").concat(domElements);
    if (isUsingPrintExtractedDataTool) {
        content += "\nONLY print the content using the print_extracted_data tool provided.\nONLY print the content using the print_extracted_data tool provided.";
    }
    return {
        role: "user",
        content: content,
    };
}
exports.buildExtractUserPrompt = buildExtractUserPrompt;
var refineSystemPrompt = "You are tasked with refining and filtering information for the final output based on newly extracted and previously extracted content. Your responsibilities are:\n1. Remove exact duplicates for elements in arrays and objects.\n2. For text fields, append or update relevant text if the new content is an extension, replacement, or continuation.\n3. For non-text fields (e.g., numbers, booleans), update with new values if they differ.\n4. Add any completely new fields or objects.\n\nReturn the updated content that includes both the previous content and the new, non-duplicate, or extended information.";
function buildRefineSystemPrompt() {
    return {
        role: "system",
        content: refineSystemPrompt,
    };
}
exports.buildRefineSystemPrompt = buildRefineSystemPrompt;
function buildRefineUserPrompt(instruction, previouslyExtractedContent, newlyExtractedContent) {
    return {
        role: "user",
        content: "Instruction: ".concat(instruction, "\nPreviously extracted content: ").concat(JSON.stringify(previouslyExtractedContent, null, 2), "\nNewly extracted content: ").concat(JSON.stringify(newlyExtractedContent, null, 2), "\nRefined content:"),
    };
}
exports.buildRefineUserPrompt = buildRefineUserPrompt;
var metadataSystemPrompt = "You are an AI assistant tasked with evaluating the progress and completion status of an extraction task.\nAnalyze the extraction response and determine if the task is completed or if more information is needed.\n\nStrictly abide by the following criteria:\n1. Once the instruction has been satisfied by the current extraction response, ALWAYS set completion status to true and stop processing, regardless of remaining chunks.\n2. Only set completion status to false if BOTH of these conditions are true:\n   - The instruction has not been satisfied yet\n   - There are still chunks left to process (chunksTotal > chunksSeen)";
function buildMetadataSystemPrompt() {
    return {
        role: "system",
        content: metadataSystemPrompt,
    };
}
exports.buildMetadataSystemPrompt = buildMetadataSystemPrompt;
function buildMetadataPrompt(instruction, extractionResponse, chunksSeen, chunksTotal) {
    return {
        role: "user",
        content: "Instruction: ".concat(instruction, "\nExtracted content: ").concat(JSON.stringify(extractionResponse, null, 2), "\nchunksSeen: ").concat(chunksSeen, "\nchunksTotal: ").concat(chunksTotal),
    };
}
exports.buildMetadataPrompt = buildMetadataPrompt;
// observe
var observeSystemPrompt = "\nYou are helping the user automate the browser by finding elements based on what the user wants to observe in the page.\nYou will be given:\n1. a instruction of elements to observe\n2. a numbered list of possible elements or an annotated image of the page\n\nReturn an array of elements that match the instruction.\n";
function buildObserveSystemPrompt() {
    var content = observeSystemPrompt.replace(/\s+/g, " ");
    return {
        role: "system",
        content: content,
    };
}
exports.buildObserveSystemPrompt = buildObserveSystemPrompt;
function buildObserveUserMessage(instruction, domElements) {
    return {
        role: "user",
        content: "instruction: ".concat(instruction, "\nDOM: ").concat(domElements),
    };
}
exports.buildObserveUserMessage = buildObserveUserMessage;
// ask
var askSystemPrompt = "\nyou are a simple question answering assistent given the user's question. respond with only the answer.\n";
function buildAskSystemPrompt() {
    return {
        role: "system",
        content: askSystemPrompt,
    };
}
exports.buildAskSystemPrompt = buildAskSystemPrompt;
function buildAskUserPrompt(question) {
    return {
        role: "user",
        content: "question: ".concat(question),
    };
}
exports.buildAskUserPrompt = buildAskUserPrompt;
