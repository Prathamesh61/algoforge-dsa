import { AlgorithmStep } from '@/types/visualizer';

export function generateMergeSortSteps(array: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...array];
  let stepIndex = 0;

  steps.push({
    stepIndex: stepIndex++,
    type: 'highlight',
    arrayState: [...arr],
    indices: [],
    message: `Initialized Merge Sort on ${arr.length} elements.`,
    pseudoCodeLine: 1,
  });

  function merge(start: number, mid: number, end: number) {
    const left = arr.slice(start, mid + 1);
    const right = arr.slice(mid + 1, end + 1);

    steps.push({
      stepIndex: stepIndex++,
      type: 'highlight',
      arrayState: [...arr],
      indices: [start, end],
      pointerLabels: { [start]: 'START', [end]: 'END' },
      highlightType: 'primary',
      message: `Merging subarrays [${start}..${mid}] and [${mid + 1}..${end}].`,
      pseudoCodeLine: 4,
    });

    let i = 0;
    let j = 0;
    let k = start;

    while (i < left.length && j < right.length) {
      steps.push({
        stepIndex: stepIndex++,
        type: 'compare',
        arrayState: [...arr],
        indices: [k],
        highlightType: 'secondary',
        message: `Comparing left value (${left[i]}) with right value (${right[j]}).`,
        pseudoCodeLine: 5,
      });

      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }

      steps.push({
        stepIndex: stepIndex++,
        type: 'modify',
        arrayState: [...arr],
        indices: [k],
        pointerLabels: { [k]: `MERGED (${arr[k]})` },
        highlightType: 'warning',
        message: `Wrote ${arr[k]} into position index ${k}.`,
        pseudoCodeLine: 6,
      });

      k++;
    }

    while (i < left.length) {
      arr[k] = left[i];
      steps.push({
        stepIndex: stepIndex++,
        type: 'modify',
        arrayState: [...arr],
        indices: [k],
        highlightType: 'warning',
        message: `Appended remaining left element ${arr[k]} to index ${k}.`,
        pseudoCodeLine: 7,
      });
      i++;
      k++;
    }

    while (j < right.length) {
      arr[k] = right[j];
      steps.push({
        stepIndex: stepIndex++,
        type: 'modify',
        arrayState: [...arr],
        indices: [k],
        highlightType: 'warning',
        message: `Appended remaining right element ${arr[k]} to index ${k}.`,
        pseudoCodeLine: 8,
      });
      j++;
      k++;
    }
  }

  function mergeSortHelper(start: number, end: number) {
    if (start >= end) return;
    const mid = Math.floor(start + (end - start) / 2);

    mergeSortHelper(start, mid);
    mergeSortHelper(mid + 1, end);
    merge(start, mid, end);
  }

  mergeSortHelper(0, arr.length - 1);

  steps.push({
    stepIndex: stepIndex++,
    type: 'complete',
    arrayState: [...arr],
    indices: Array.from({ length: arr.length }, (_, idx) => idx),
    highlightType: 'success',
    message: 'Merge Sort completed! Array fully sorted in O(n log n) time.',
    pseudoCodeLine: 9,
  });

  return steps;
}
