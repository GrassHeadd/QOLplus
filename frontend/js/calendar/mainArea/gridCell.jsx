import React from "react";

export default function GridCell() {
    function getSimplePath() {
        var string = "", shift = 1.2;

        if (Math.random() >= 0.5) {
            const mid = Math.round(Math.random() * 50);
            string += "M0," + Math.round(Math.random() * shift) +
                " L" + mid + "," + Math.round(Math.random() * shift) +
                " L" + (mid + Math.round(Math.random() * (100 - mid))) + "," + Math.round(Math.random() * shift);
        }

        if (Math.random() >= 0.5) {
            const mid = Math.round(Math.random() * 50);
            string += " M0," + (100 - Math.round(Math.random() * shift)) +
                " L" + mid + "," + (100 - Math.round(Math.random() * shift)) +
                " L" + (mid + Math.round(Math.random() * (100 - mid))) + "," + (100 - Math.round(Math.random() * shift));
        }

        if (Math.random() >= 0.5) {
            const mid = Math.round(Math.random() * 50);
            string += " M" + Math.round(Math.random() * shift) + ",0" +
                " L" + Math.round(Math.random() * shift) + "," + mid +
                " L" + Math.round(Math.random() * shift) + "," + (mid + Math.round(Math.random() * (100 - mid)));
        }


        if (Math.random() >= 0.5) {
            const mid = Math.round(Math.random() * 50);
            string += " M" + (100 - Math.round(Math.random() * shift)) + ",0" +
                " L" + (100 - Math.round(Math.random() * shift)) + "," + mid +
                " L" + (100 - Math.round(Math.random() * shift)) + "," + (mid + Math.round(Math.random() * (100 - mid)));
        }


        return string;
    }

    function getSimplePath2() {
        var string = "", maxShift = 0.5, maxLenPerIteration = 50;

        string += " M0," + Math.round(Math.random() * maxShift);
        var start = 0;
        while (start < 100) {
            // To prevent 100% change of top left corner line going right always appearing
            if (start > 0 || Math.random() >= 0.5) {
                // Line
                start += Math.round(Math.random() * maxLenPerIteration);
                string += " L" + start + "," + Math.round(Math.random() * maxShift);
            }

            // Spacing
            start += Math.round(Math.random() * (100 - start));
            string += " M" + start + "," + Math.round(Math.random() * maxShift);
        }

        string += " M" + Math.round(Math.random() * maxShift) + ",0";
        start = 0;
        while (start < 100) {
            // To prevent 100% change of top left corner line going right always appearing
            if (start > 0 || Math.random() >= 0.5) {
                // Line
                start += Math.round(Math.random() * maxLenPerIteration);
                string += " L" + Math.round(Math.random() * maxShift) + "," + start;
            }

            // Spacing
            start += Math.round(Math.random() * (100 - start));
            string += " M" + Math.round(Math.random() * maxShift) + "," + start;
        }

        string += " M0," + (100 - Math.round(Math.random() * maxShift));
        start = 0;
        while (start < 100) {
            // To prevent 100% change of top left corner line going right always appearing
            if (start > 0 || Math.random() >= 0.5) {
                // Line
                start += Math.round(Math.random() * maxLenPerIteration);
                string += " L" + start + "," + (100 - Math.round(Math.random() * maxShift));
            }

            // Spacing
            start += Math.round(Math.random() * (100 - start));
            string += " M" + start + "," + (100 - Math.round(Math.random() * maxShift));
        }

        string += " M" + (100 - Math.round(Math.random() * maxShift)) + ",0";
        start = 0;
        while (start < 100) {
            // To prevent 100% change of top left corner line going right always appearing
            if (start > 0 || Math.random() >= 0.5) {
                // Line
                start += Math.round(Math.random() * maxLenPerIteration);
                string += " L" + (100 - Math.round(Math.random() * maxShift)) + "," + start;
            }

            // Spacing
            start += Math.round(Math.random() * (100 - start));
            string += " M" + (100 - Math.round(Math.random() * maxShift)) + "," + start;
        }


        return string;
    }

    return (
        <div className="gridCell">
            <p>1</p>
            <svg class="border" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* <path d="
                            M0,1 L30,1, L50,0 
                            M0,99 L30,99 L50,99
                            M1,0, L1,30 L0.5,50
                            M99,50 L99,100
                            "
                    stroke="rgb(86, 85, 85)" fill="none" stroke-width="1" /> */}

                <path d={getSimplePath2()} stroke="rgb(95, 95, 95)" fill="none" stroke-width="1" />
            </svg>
        </div>
    );
}