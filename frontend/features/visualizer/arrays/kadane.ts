import { AlgorithmStep } from '@/types/visualizer';

export function generateKadaneSteps(array: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...array];
  let stepIndex = 0;

  let currentSum = arr[0];
  let maxSum = arr[0];
  let bestStart = 0;
  let bestEnd = 0;
  let currentStart = 0;

  steps.push({
    stepIndex: stepIndex++,
    type: 'highlight',
    arrayState: [...arr],
    indices: [0],
    pointerLabels: { 0: `INIT (${arr[0]})` },
    highlightType: 'primary',
    message: `Initialized Kadane's algorithm. Starting with currentSum = ${currentSum}, maxSum = ${maxSum}.`,
    pseudoCodeLine: 1,
  });

  for (let i = 1; i < arr.length; i++) {
    const val = arr[i];

    if (val > currentSum + val) {
      currentSum = val;
      currentStart = i;
      steps.push({
        stepIndex: stepIndex++,
        type: 'modify',
        arrayState: [...arr],
        indices: [i],
        pointerLabels: { [i]: 'RESET' },
        highlightType: 'warning',
        message: `Element ${val} > previous accumulated sum (${currentSum - val} + ${val}). Starting new subarray window at index ${i}.`,
        pseudoCodeLine: 3,
      });
    } else {
      currentSum += val;
      steps.push({
        stepIndex: stepIndex++,
        type: 'compare',
        arrayState: [...arr],
        indices: [currentStart, i],
        pointerLabels: { [currentStart]: 'START', [i]: 'END' },
        highlightType: 'secondary',
        message: `Added arr[${i}] (${val}) to current window. Updated currentSum = ${currentSum}.`,
        pseudoCodeLine: 4,
      });
    }

    if (currentSum > maxSum) {
      maxSum = currentSum;
      bestStart = currentStart;
      bestEnd = i;

      steps.push({
        stepIndex: stepIndex++,
        type: 'modify',
        arrayState: [...arr],
        indices: Array.from({ length: bestEnd - bestStart + 1 }, (_, idx) => bestStart + idx),
        pointerLabels: { [bestStart]: 'BEST L', [bestEnd]: 'BEST R' },
        highlightType: 'success',
        message: `New maximum subarray sum found: ${maxSum} spanning indices [${bestStart}..${bestEnd}].`,
        pseudoCodeLine: 5,
      });
    }
  }

  steps.push({
    stepIndex: stepIndex++,
    type: 'complete',
    arrayState: [...arr],
    indices: Array.from({ length: bestEnd - bestStart + 1 }, (_, idx) => bestStart + idx),
    highlightType: 'success',
    message: `Kadane's algorithm complete! Maximum subarray sum is ${maxSum} in range [${bestStart}..${bestEnd}].`,
    pseudoCodeLine: 6,
  });

  return steps;
}
