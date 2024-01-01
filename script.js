const frogContainer = document.getElementById('frog-container');
        const resetButton = document.getElementById('reset-button');
        const lilypadCounter = document.getElementById('lilypad-counter');

        const speedSlider = document.getElementById('speed-slider');
        const speedValue = document.getElementById('speed-value');

        // Set initial speed
        let frogSpeed = 1;

        // Event listener for the slider
        speedSlider.addEventListener('input', () => {
            frogSpeed = parseInt(speedSlider.value);
            speedValue.textContent = `Current Speed: ${frogSpeed}`;
        });
        
        const padSlider = document.getElementById('pad-slider');
        const padValue = document.getElementById('pad-value');

        let padMultiplier = 1;

        padSlider.addEventListener('input', () => {
            padMultiplier = parseInt(padSlider.value);
            padValue.textContent = `Lilypad Mulitplier: ${padMultiplier}`;
        });


        const colorSlider = document.getElementById('color-slider');
        colorSlider.addEventListener('input', () => {
            const hue = colorSlider.value; // Get the hue value from the slider

            // Update the frog's color using HSL color representation
            frogContainer.style.filter = `hue-rotate(${hue}deg)`;
        });


        let isButtonClicked = false;
        let lilypadsEaten = 0;

        // Object to track pressed keys
        const pressedKeys = {
            w: false,
            a: false,
            s: false,
            d: false,
        };

        // Function to reset the frog to the center
        const resetFrog = () => {
            const centerX = window.innerWidth / 2 - frogContainer.clientWidth / 2;
            const centerY = window.innerHeight / 2 - frogContainer.clientHeight / 2;

            frogContainer.style.left = centerX + 'px';
            frogContainer.style.top = centerY + 'px';
        };

        resetButton.addEventListener('click', () => {
            isButtonClicked = true;
            lilypadsEaten = 0;
            lilypadCounter.textContent = `LILYPADS EATEN: 0`;

            resetFrog();
            isButtonClicked = false
        });

        // Function to handle keydown events and move the frog
        const handleKeyDown = (event) => {
            pressedKeys[event.key.toLowerCase()] = true;
        };

        // Function to handle keyup events
        const handleKeyUp = (event) => {
            pressedKeys[event.key.toLowerCase()] = false;
        };

        // Add event listeners for keydown and keyup events
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        // Function to handle key presses and move the frog
        const handleKeyPress = () => {
            const step = 5 * frogSpeed; // Adjust the step size as needed
            let newLeft = frogContainer.offsetLeft;
            let newTop = frogContainer.offsetTop;

            if (!isButtonClicked) { 
                let rotation = 'rotate(0deg)';    
                if (pressedKeys['w']) {
                    newTop = Math.max(0, frogContainer.offsetTop - step);
                } 
                if (pressedKeys['a']) {
                    newLeft = Math.max(0, frogContainer.offsetLeft - step);
                    rotation = 'rotate(-15deg)';
                }
                if (pressedKeys['s']) {
                    newTop = Math.min(window.innerHeight - frogContainer.clientHeight, frogContainer.offsetTop + step);
                }
                if (pressedKeys['d']) {
                    newLeft = Math.min(window.innerWidth - frogContainer.clientWidth, frogContainer.offsetLeft + step);
                    rotation = 'rotate(15deg)';
                }
            
                frogContainer.style.transform = rotation;
                

                frogContainer.style.left = newLeft + 'px';
                frogContainer.style.top = newTop + 'px';
            }

            // Continue handling key presses
            requestAnimationFrame(handleKeyPress);
        };

        // Call the function to handle key presses
        requestAnimationFrame(handleKeyPress);


            // Function to generate random lilypads
            const generateLilypads = () => {
                const numLilypads = Math.floor(Math.random() * 10 * padMultiplier) + 1; // Random number between 1 and 5

                for (let i = 0; i < numLilypads; i++) {
                    const lilypad = document.createElement('div');
                    lilypad.classList.add('lilypad');

                    // Set random position for the lilypad
                    const randomX = Math.random() * (window.innerWidth - 50);
                    const randomY = Math.random() * (window.innerHeight - 50);

                    lilypad.style.left = `${randomX}px`;
                    lilypad.style.top = `${randomY}px`;

                    document.body.appendChild(lilypad);
                }
            };

            // Call the function to generate lilypads
            generateLilypads();

            // Function to check for frog-lilypad collisions
            // Function to check for frog-lilypad collisions
            const checkCollisions = () => {
                const lilypads = document.querySelectorAll('.lilypad');

                lilypads.forEach((lilypad) => {
                    const frogRect = frogContainer.getBoundingClientRect();
                    const lilypadRect = lilypad.getBoundingClientRect();

                    // Log the positions for debugging
                    console.log('Frog:', frogRect);
                    console.log('Lilypad:', lilypadRect);

                    // Check for collision on all sides of the frog
                    if (
                        frogRect.left < lilypadRect.right &&
                        frogRect.right > lilypadRect.left &&
                        frogRect.top < lilypadRect.bottom &&
                        frogRect.bottom > lilypadRect.top
                    ) {
                        console.log('Collision Detected!');
                        lilypad.remove(); // Remove the lilypad when the frog overlaps
                        lilypadsEaten++; 
                        lilypadCounter.textContent = `LILYPADS EATEN: ${lilypadsEaten}`;
                        
                        // Change the frog image when a lilypad is eaten
                        frogContainer.style.backgroundImage = 'url("frogeating.png")';

                        // Reset the frog image after a short delay
                        setTimeout(() => {
                            frogContainer.style.backgroundImage = 'url("frog.png")';
                        }, 300); // Adjust the delay as needed

                        
                    }
                });

                if (document.querySelectorAll('.lilypad').length === 0) {
                    // If all lilypads are collected, generate new ones
                    generateLilypads();
                }
                requestAnimationFrame(checkCollisions);
            };

         requestAnimationFrame(checkCollisions);

        const modal = document.getElementById('modal');

        // Function to open the modal
        function openModal() {
            modal.style.display = 'block';
        }

        // Function to close the modal
        function closeModal() {
            modal.style.display = 'none';
        }