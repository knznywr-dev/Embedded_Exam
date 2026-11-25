import { useMemo, useState } from 'react';
import { Icon } from '../../components/Icon';
import { SourceRef } from '../../components/ui';
import { LAB_DEBUG_PAIRS } from '../../data/labs';

const ALL_CAUSES = Array.from(new Set(LAB_DEBUG_PAIRS.map((pair) => pair.cause)));

function buildOptions(correct: string, seed: number): string[] {
  const distractors = ALL_CAUSES.filter((cause) => cause !== correct);
  const picked: string[] = [];
  for (let offset = 0; offset < distractors.length && picked.length < 2; offset += 1) {
    picked.push(distractors[(seed + offset) % distractors.length]);
  }
  const options = [correct, ...picked];
  // Keep a stable but non-trivial order for the correct answer.
  const rotate = seed % options.length;
  return [...options.slice(rotate), ...options.slice(0, rotate)];
}

export function DebuggingPractice() {
  const [index, setIndex] = useState(0);
  const [seed, setSeed] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, answered: 0 });
  const [roundComplete, setRoundComplete] = useState(false);

  const pair = LAB_DEBUG_PAIRS[index];
  const options = useMemo(() => buildOptions(pair.cause, seed), [pair, seed]);
  const isCorrect = selected === pair.cause;

  const next = () => {
    if (index + 1 >= LAB_DEBUG_PAIRS.length) {
      setRoundComplete(true);
      return;
    }
    setIndex(index + 1);
    setSeed((value) => value + 1);
    setSelected(null);
  };

  const restart = () => {
    setIndex(0);
    setSeed(0);
    setSelected(null);
    setScore({ correct: 0, answered: 0 });
    setRoundComplete(false);
  };

  if (roundComplete) {
    return (
      <div className="debug-demo debug-complete">
        <span className="debug-complete-icon">
          <Icon name="check" size={26} />
        </span>
        <h4>All six reviewer scenarios completed</h4>
        <p>
          You identified <strong>{score.correct}</strong> of <strong>{score.answered}</strong>{' '}
          reviewer-listed causes correctly.
        </p>
        <p className="demo-caveat">
          This drill uses only the six problem/cause pairs printed in the reviewer. Real debugging
          can involve other causes that the reviewer does not list.
        </p>
        <button type="button" className="btn btn-primary btn-small" onClick={restart}>
          <Icon name="refresh" size={14} /> Run again
        </button>
      </div>
    );
  }

  return (
    <div className="debug-demo">
      <div className="debug-head">
        <div>
          <span className="detail-kicker">
            <Icon name="warning" size={14} /> Case {index + 1} of {LAB_DEBUG_PAIRS.length}
          </span>
          <h4>{pair.problem}</h4>
          <p>Which possible cause does the reviewer list for this problem?</p>
        </div>
        <div className="debug-score">
          <span>Score</span>
          <strong>
            {score.correct}/{score.answered}
          </strong>
        </div>
      </div>

      <div className="debug-options" role="group" aria-label="Possible causes">
        {options.map((option) => {
          const chosen = selected === option;
          const showCorrect = selected !== null && option === pair.cause;
          const showWrong = chosen && option !== pair.cause;
          return (
            <button
              key={option}
              type="button"
              className={`debug-option ${showCorrect ? 'is-correct' : ''} ${showWrong ? 'is-wrong' : ''}`}
              disabled={selected !== null}
              onClick={() => {
                setSelected(option);
                setScore((current) => ({
                  correct: current.correct + (option === pair.cause ? 1 : 0),
                  answered: current.answered + 1,
                }));
              }}
            >
              <span className="debug-option-marker">
                {showCorrect ? (
                  <Icon name="check" size={15} />
                ) : showWrong ? (
                  <Icon name="close" size={15} />
                ) : (
                  <span />
                )}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      <div className="debug-feedback" aria-live="polite">
        {selected === null ? (
          <span className="debug-prompt">Select the cause the reviewer gives.</span>
        ) : (
          <div className={isCorrect ? 'is-good' : 'is-bad'}>
            <Icon name={isCorrect ? 'check' : 'warning'} size={17} />
            <div>
              <strong>{isCorrect ? 'Correct' : 'Not the reviewer’s cause'}</strong>
              <p>
                The reviewer pairs “{pair.problem}” with “{pair.cause}”.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="debug-foot">
        <SourceRef page={10} />
        <div className="debug-actions">
          {selected !== null ? (
            <button type="button" className="btn btn-primary btn-small" onClick={next}>
              {index + 1 >= LAB_DEBUG_PAIRS.length ? 'Finish' : 'Next case'}
              <Icon name="arrow-right" size={14} />
            </button>
          ) : null}
          <button type="button" className="btn btn-ghost btn-small" onClick={restart}>
            <Icon name="refresh" size={14} /> Restart
          </button>
        </div>
      </div>
    </div>
  );
}
