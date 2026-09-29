import { AlgorithmStep } from '@/types/visualizer';

export function generateSelectionSortSteps(array: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...array];
  const n = arr.length;
  let stepIndex = 0;

  steps.push({
    stepIndex: stepIndex++,
    type: 'highlight',
    arrayState: [...arr],
    indices: [],
    message: `Initialized Selection Sort on ${n} elements.`,
    pseudoCodeLine: 1,
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    steps.push({
      stepIndex: stepIndex++,
      type: 'highlight',
      arrayState: [...arr],
      indices: [i],
      pointerLabels: { [i]: 'CURRENT' },
      highlightType: 'primary',
      message: `Pass ${i + 1}: Finding smallest element starting from index ${i}. Initial minIdx = ${i} (value ${arr[i]}).`,
      pseudoCodeLine: 2,
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        stepIndex: stepIndex++,
        type: 'compare',
        arrayState: [...arr],
        indices: [minIdx, j],
        pointerLabels: { [minIdx]: 'MIN', [j]: 'j' },
        highlightType: 'secondary',
        message: `Comparing current minimum arr[${minIdx}] (${arr[minIdx]}) with arr[${j}] (${arr[j]}).`,
        pseudoCodeLine: 4,
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          stepIndex: stepIndex++,
          type: 'highlight',
          arrayState: [...arr],
          indices: [minIdx],
          pointerLabels: { [minIdx]: 'NEW MIN' },
          highlightType: 'warning',
          message: `Found smaller element! Updated minIdx = ${minIdx} (value ${arr[minIdx]}).`,
          pseudoCodeLine: 5,
        });
      }
    }

    if (minIdx !== i) {
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;

      steps.push({
        stepIndex: stepIndex++,
        type: 'swap',
        arrayState: [...arr],
        indices: [i, minIdx],
        pointerLabels: { [i]: 'PLACED', [minIdx]: 'SWAPPED' },
        highlightType: 'warning',
        message: `Swapped minimum element ${arr[i]} into sorted position index ${i}.`,
        pseudoCodeLine: 6,
      });
    }

    steps.push({
      stepIndex: stepIndex++,
      type: 'modify',
      arrayState: [...arr],
      indices: [i],
      pointerLabels: { [i]: 'SORTED' },
      highlightType: 'success',
      message: `Index ${i} is now locked in sorted order.`,
      pseudoCodeLine: 7,
    });
  }

  steps.push({
    stepIndex: stepIndex++,
    type: 'complete',
    arrayState: [...arr],
    indices: Array.from({ length: n }, (_, idx) => idx),
    highlightType: 'success',
    message: 'Selection Sort completed! All elements placed in ascending order.',
    pseudoCodeLine: 8,
  });

  return steps;
}
