import { EvalFunction } from "../../types/evals";
import { initStagehand } from "../utils";
import { z } from "zod";

export const imdb_movie_details: EvalFunction = async ({
  modelName,
  logger,
}) => {
  const { stagehand, initResponse } = await initStagehand({
    modelName,
    logger,
  });

  const { debugUrl, sessionUrl } = initResponse;

  await stagehand.page.goto("https://www.imdb.com/title/tt0111161/", {
    waitUntil: "domcontentloaded",
  });
  await stagehand.act({
    action: "click on the movie ratings",
  });

  const movieDetails = await stagehand.extract({
    instruction: "Extract the list of countries with the most ratings.",
    schema: z.object({
      countries: z
        .array(z.string())
        .describe("List of countries with the most ratings"),
    }),
    modelName,
  });

  await stagehand.close();

  const expectedCountries = [
    "United States",
    "United Kingdom",
    "Turkey",
    "India",
    "Germany",
  ];

  if (!movieDetails.countries || movieDetails.countries.length !== 5) {
    logger.error({
      message: "Failed to extract exactly five countries",
      level: 0,
      auxiliary: {
        expected: {
          value: JSON.stringify(expectedCountries),
          type: "array",
        },
        actual: {
          value: JSON.stringify(movieDetails.countries || []),
          type: "array",
        },
      },
    });

    return {
      _success: false,
      error: "Incorrect number of countries extracted",
      logs: logger.getLogs(),
      debugUrl,
      sessionUrl,
    };
  }

  const missingCountries = expectedCountries.filter(
    (country) => !movieDetails.countries.includes(country),
  );

  if (missingCountries.length > 0) {
    logger.error({
      message: "Extracted countries do not match expected countries",
      level: 0,
      auxiliary: {
        missing: {
          value: JSON.stringify(missingCountries),
          type: "array",
        },
        extracted: {
          value: JSON.stringify(movieDetails.countries),
          type: "array",
        },
      },
    });

    return {
      _success: false,
      error: "Extracted countries do not match expected countries",
      logs: logger.getLogs(),
      debugUrl,
      sessionUrl,
    };
  }

  return {
    _success: true,
    countries: movieDetails.countries,
    logs: logger.getLogs(),
    debugUrl,
    sessionUrl,
  };
};