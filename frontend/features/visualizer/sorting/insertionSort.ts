import { AlgorithmStep } from '@/types/visualizer';

export function generateInsertionSortSteps(array: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...array];
  const n = arr.length;
  let stepIndex = 0;

  steps.push({
    stepIndex: stepIndex++,
    type: 'highlight',
    arrayState: [...arr],
    indices: [0],
    pointerLabels: { 0: 'SORTED' },
    message: `Initialized Insertion Sort. Single element at index 0 is trivially sorted.`,
    pseudoCodeLine: 1,
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push({
      stepIndex: stepIndex++,
      type: 'highlight',
      arrayState: [...arr],
      indices: [i],
      pointerLabels: { [i]: `KEY (${key})` },
      highlightType: 'primary',
      message: `Selecting key = ${key} at index ${i}. Inserting into sorted subarray [0..${i - 1}].`,
      pseudoCodeLine: 2,
    });

    while (j >= 0 && arr[j] > key) {
      steps.push({
        stepIndex: stepIndex++,
        type: 'compare',
        arrayState: [...arr],
        indices: [j, j + 1],
        pointerLabels: { [j]: 'COMPARE', [j + 1]: 'SHIFT' },
        highlightType: 'secondary',
        message: `arr[${j}] (${arr[j]}) > key (${key}). Shifting arr[${j}] to index ${j + 1}.`,
        pseudoCodeLine: 4,
      });

      arr[j + 1] = arr[j];

      steps.push({
        stepIndex: stepIndex++,
        type: 'modify',
        arrayState: [...arr],
        indices: [j + 1],
        highlightType: 'warning',
        message: `Shifted ${arr[j + 1]} to index ${j + 1}.`,
        pseudoCodeLine: 5,
      });

      j--;
    }

    arr[j + 1] = key;

    steps.push({
      stepIndex: stepIndex++,
      type: 'modify',
      arrayState: [...arr],
      indices: [j + 1],
      pointerLabels: { [j + 1]: 'INSERTED' },
      highlightType: 'success',
      message: `Inserted key ${key} at target position index ${j + 1}. Subarray [0..${i}] is now sorted.`,
      pseudoCodeLine: 6,
    });
  }

  steps.push({
    stepIndex: stepIndex++,
    type: 'complete',
    arrayState: [...arr],
    indices: Array.from({ length: n }, (_, idx) => idx),
    highlightType: 'success',
    message: 'Insertion Sort completed! Array is now sorted.',
    pseudoCodeLine: 7,
  });

  return steps;
}
