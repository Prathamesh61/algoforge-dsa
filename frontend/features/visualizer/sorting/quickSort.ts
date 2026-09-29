import { AlgorithmStep } from '@/types/visualizer';

export function generateQuickSortSteps(array: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...array];
  let stepIndex = 0;

  steps.push({
    stepIndex: stepIndex++,
    type: 'highlight',
    arrayState: [...arr],
    indices: [],
    message: `Initialized Quick Sort on ${arr.length} elements.`,
    pseudoCodeLine: 1,
  });

  function partition(low: number, high: number): number {
    const pivot = arr[high];
    steps.push({
      stepIndex: stepIndex++,
      type: 'highlight',
      arrayState: [...arr],
      indices: [high],
      pointerLabels: { [high]: `PIVOT (${pivot})` },
      highlightType: 'primary',
      message: `Selected pivot = ${pivot} at index ${high}. Partitioning subarray [${low}..${high}].`,
      pseudoCodeLine: 3,
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({
        stepIndex: stepIndex++,
        type: 'compare',
        arrayState: [...arr],
        indices: [j, high],
        pointerLabels: { [j]: 'j', [high]: 'PIVOT' },
        highlightType: 'secondary',
        message: `Comparing arr[${j}] (${arr[j]}) with pivot (${pivot}).`,
        pseudoCodeLine: 4,
      });

      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;

          steps.push({
            stepIndex: stepIndex++,
            type: 'swap',
            arrayState: [...arr],
            indices: [i, j],
            pointerLabels: { [i]: 'SWAP', [j]: 'SWAP' },
            highlightType: 'warning',
            message: `arr[${j}] < pivot -> Swapped element ${arr[i]} with ${arr[j]}.`,
            pseudoCodeLine: 5,
          });
        }
      }
    }

    // Place pivot in correct position
    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;

    const pivotPos = i + 1;
    steps.push({
      stepIndex: stepIndex++,
      type: 'modify',
      arrayState: [...arr],
      indices: [pivotPos],
      pointerLabels: { [pivotPos]: 'PIVOT SET' },
      highlightType: 'success',
      message: `Placed pivot ${arr[pivotPos]} into its finalized partitioned position index ${pivotPos}.`,
      pseudoCodeLine: 6,
    });

    return pivotPos;
  }

  function quickSortHelper(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    }
  }

  quickSortHelper(0, arr.length - 1);

  steps.push({
    stepIndex: stepIndex++,
    type: 'complete',
    arrayState: [...arr],
    indices: Array.from({ length: arr.length }, (_, idx) => idx),
    highlightType: 'success',
    message: 'Quick Sort completed! Subarrays partitioned and sorted.',
    pseudoCodeLine: 8,
  });

  return steps;
}
