import { AlgorithmStep } from '@/types/visualizer';

export function generateBubbleSortSteps(array: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...array];
  const n = arr.length;
  let stepIndex = 0;

  steps.push({
    stepIndex: stepIndex++,
    type: 'highlight',
    arrayState: [...arr],
    indices: [],
    message: `Initialized Bubble Sort on ${n} elements.`,
    pseudoCodeLine: 1,
  });

  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      // Comparison step
      steps.push({
        stepIndex: stepIndex++,
        type: 'compare',
        arrayState: [...arr],
        indices: [j, j + 1],
        pointerLabels: { [j]: 'j', [j + 1]: 'j+1' },
        highlightType: 'primary',
        message: `Comparing adjacent elements at [${j}] and [${j + 1}]: ${arr[j]} vs ${arr[j + 1]}.`,
        pseudoCodeLine: 4,
      });

      if (arr[j] > arr[j + 1]) {
        // Swap
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;

        steps.push({
          stepIndex: stepIndex++,
          type: 'swap',
          arrayState: [...arr],
          indices: [j, j + 1],
          pointerLabels: { [j]: 'SWAP', [j + 1]: 'SWAP' },
          highlightType: 'warning',
          message: `${arr[j + 1]} > ${arr[j]} -> Swapped ${arr[j]} and ${arr[j + 1]}.`,
          pseudoCodeLine: 5,
        });
      }
    }

    // Element at n - i - 1 is now in its final sorted position
    steps.push({
      stepIndex: stepIndex++,
      type: 'modify',
      arrayState: [...arr],
      indices: [n - i - 1],
      pointerLabels: { [n - i - 1]: 'SORTED' },
      highlightType: 'success',
      message: `Pass ${i + 1} complete. Element ${arr[n - i - 1]} is placed in its sorted position.`,
      pseudoCodeLine: 6,
    });

    if (!swapped) {
      steps.push({
        stepIndex: stepIndex++,
        type: 'complete',
        arrayState: [...arr],
        indices: [],
        highlightType: 'success',
        message: `No swaps occurred during pass ${i + 1}. Array is fully sorted!`,
        pseudoCodeLine: 7,
      });
      break;
    }
  }

  // Completion step
  steps.push({
    stepIndex: stepIndex++,
    type: 'complete',
    arrayState: [...arr],
    indices: Array.from({ length: n }, (_, i) => i),
    highlightType: 'success',
    message: `Bubble Sort finished. All elements are sorted in ascending order.`,
    pseudoCodeLine: 8,
  });

  return steps;
}
