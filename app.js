// Wolf Kill Personality Test App
document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');

    // State
    let currentView = 'home'; // 'home', 'test', 'result'
    let currentQuestionIndex = 0;
    let answers = []; // array of {questionId, optionIndex, scores}
    let result = null;

    // Render functions
    function render() {
        switch (currentView) {
            case 'home':
                renderHome();
                break;
            case 'test':
                renderTest();
                break;
            case 'result':
                renderResult();
                break;
        }
    }

    function renderHome() {
        app.innerHTML = `
            <div class="fade-in">
                <header class="text-center mb-12">
                    <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">${frontendText.title}</h1>
                    <p class="text-xl text-gray-600 mb-8">${frontendText.subtitle}</p>
                    <div class="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
                </header>

                <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12 card-hover">
                    <div class="flex flex-col md:flex-row items-center">
                        <div class="md:w-2/3 mb-8 md:mb-0 md:pr-12">
                            <h2 class="text-2xl font-bold text-gray-800 mb-4">测试说明</h2>
                            <ul class="text-gray-700 space-y-3">
                                <li class="flex items-start">
                                    <i class="fas fa-check text-green-500 mt-1 mr-3"></i>
                                    <span>本测试共 <span class="font-bold text-blue-600">${questions.length}</span> 道选择题，基于你在狼人杀游戏中的真实表现</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-check text-green-500 mt-1 mr-3"></i>
                                    <span>每题只选 <span class="font-bold text-blue-600">最符合你</span> 的选项，不要犹豫，凭直觉选择</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-check text-green-500 mt-1 mr-3"></i>
                                    <span>完成测试后，将获得专属人格报告，并可以分享给好友</span>
                                </li>
                            </ul>
                        </div>
                        <div class="md:w-1/3 text-center">
                            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
                                <i class="fas fa-users text-6xl text-blue-500 mb-6"></i>
                                <h3 class="text-xl font-bold text-gray-800 mb-4">立即开始测试</h3>
                                <p class="text-gray-600 mb-6">只需3-5分钟，了解你在狼人杀中的真实人格</p>
                                <button onclick="startTest()" class="btn bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-4 px-8 rounded-full text-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all w-full">
                                    <i class="fas fa-play mr-2"></i>${frontendText.buttons.start}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center">
                    <h3 class="text-2xl font-bold text-gray-800 mb-6">30种可能的人格结果</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-12">
                        ${personalities.slice(0, 10).map(p => `
                            <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <div class="font-bold text-gray-800">${p.name}</div>
                                <div class="text-sm text-gray-600 mt-1 truncate">${p.description.split(' ')[0]}</div>
                            </div>
                        `).join('')}
                    </div>
                    <p class="text-gray-500">还有 ${personalities.length - 10} 种人格等你发现...</p>
                </div>
            </div>
        `;
    }

    function renderTest() {
        const question = questions[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        const selectedAnswer = answers.find(a => a.questionId === question.id);

        app.innerHTML = `
            <div class="fade-in max-w-3xl mx-auto">
                <div class="flex justify-between items-center mb-8">
                    <button onclick="goHome()" class="text-gray-600 hover:text-gray-800 flex items-center">
                        <i class="fas fa-arrow-left mr-2"></i>返回首页
                    </button>
                    <div class="text-gray-600">
                        第 <span class="font-bold text-blue-600">${currentQuestionIndex + 1}</span> / ${questions.length} 题
                    </div>
                </div>

                <div class="mb-8">
                    <div class="progress-bar">
                        <div class="progress-fill bg-gradient-to-r from-blue-400 to-indigo-500" style="width: ${progress}%"></div>
                    </div>
                </div>

                <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6">${question.text}</h2>

                    <div class="space-y-4">
                        ${question.options.map((option, idx) => {
                            const isSelected = selectedAnswer && selectedAnswer.optionIndex === idx;
                            return `
                                <div class="option-item p-5 border-2 rounded-xl cursor-pointer transition-all ${isSelected ? 'option-selected border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}"
                                     onclick="selectOption(${idx})">
                                    <div class="flex items-start">
                                        <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'} font-bold mr-4">
                                            ${option.letter}
                                        </div>
                                        <div class="flex-grow">
                                            <div class="font-medium text-gray-800 text-lg">${option.text}</div>
                                            ${isSelected ? '<div class="mt-2 text-blue-600"><i class="fas fa-check-circle mr-2"></i>已选择</div>' : ''}
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <div class="flex justify-between">
                    <button onclick="prevQuestion()" class="btn bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all ${currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}" ${currentQuestionIndex === 0 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-left mr-2"></i>上一题
                    </button>

                    <div class="text-center">
                        ${selectedAnswer ? `
                            <div class="text-green-600 mb-2">
                                <i class="fas fa-check-circle mr-2"></i>已选择选项
                            </div>
                        ` : ''}
                        <button onclick="nextQuestion()" class="btn ${selectedAnswer ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'} text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all">
                            ${currentQuestionIndex === questions.length - 1 ? '查看结果' : '下一题'}
                            <i class="fas fa-chevron-right ml-2"></i>
                        </button>
                    </div>

                    <button onclick="skipQuestion()" class="btn bg-gray-100 text-gray-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all">
                        跳过
                    </button>
                </div>

                <div class="mt-12 text-center text-gray-500 text-sm">
                    <p><i class="fas fa-lightbulb mr-2"></i>提示：选择最符合你真实游戏行为的选项，不要过度思考</p>
                </div>
            </div>
        `;
    }

    function renderResult() {
        if (!result) {
            calculateResult();
        }

        const personality = personalities.find(p => p.id === result.personalityId) || personalities[0];

        app.innerHTML = `
            <div class="fade-in max-w-4xl mx-auto">
                <div class="text-center mb-12">
                    <h1 class="text-4xl font-bold text-gray-800 mb-4">测试完成！</h1>
                    <p class="text-xl text-gray-600">你的狼人杀人格是</p>
                </div>

                <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8 mb-8 border border-blue-100">
                    <div class="flex flex-col md:flex-row items-center">
                        <div class="md:w-1/3 text-center mb-8 md:mb-0">
                            <div class="inline-block p-6 bg-white rounded-full shadow-lg">
                                <i class="fas fa-crown text-6xl text-yellow-500"></i>
                            </div>
                            <div class="mt-6">
                                <div class="text-5xl font-bold text-blue-600 mb-2">${result.score}</div>
                                <div class="text-gray-600">匹配度评分</div>
                            </div>
                        </div>
                        <div class="md:w-2/3 md:pl-12">
                            <h2 class="text-3xl font-bold text-gray-800 mb-4">${personality.name}</h2>
                            <p class="text-gray-700 text-lg mb-4">${personality.description}</p>
                            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r">
                                <p class="text-blue-800 font-medium">${personality.detailed}</p>
                            </div>
                            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h3 class="text-xl font-bold text-gray-800 mb-4">人格类型说明</h3>
                                <p class="text-gray-700 mb-4">你在狼人杀游戏中展现出 <span class="font-bold text-blue-600">${personality.name}</span> 的特质，这种人格类型反映了你在游戏中的典型行为模式和决策风格。</p>
                                <p class="text-gray-700">每种人格都有其独特的优势和玩法，了解自己的人格类型可以帮助你在游戏中更好地发挥自己的长处！</p>
                            </div>

                            <!-- Radar chart for dimension scores -->
                            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-8">
                                <h3 class="text-xl font-bold text-gray-800 mb-4">人格维度分析</h3>
                                <p class="text-gray-600 mb-6">以下是你在6个核心维度上的得分分布：</p>
                                <div class="relative h-64 md:h-80">
                                    <canvas id="radarChart"></canvas>
                                </div>
                                <div class="mt-6 text-sm text-gray-500">
                                    <p><i class="fas fa-info-circle mr-2"></i>每个维度得分范围1-3，越高表示越偏向右侧特质</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Warning notice -->
                <div class="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-12 rounded-r-lg">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <i class="fas fa-exclamation-triangle text-yellow-500 text-2xl"></i>
                        </div>
                        <div class="ml-4">
                            <h3 class="text-lg font-bold text-yellow-800">重要声明</h3>
                            <p class="text-yellow-700 mt-2">未经允许不得转载社交媒体<br>作者：有入自林中坠落</p>
                        </div>
                    </div>
                </div>

                <!-- Action buttons -->
                <div class="text-center">
                    <button onclick="goHome()" class="btn bg-gradient-to-r from-gray-500 to-gray-700 text-white font-bold py-4 px-10 rounded-full hover:from-gray-600 hover:to-gray-800 mr-6">
                        <i class="fas fa-home mr-2"></i>回到首页
                    </button>
                    <button onclick="restartTest()" class="btn bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-4 px-10 rounded-full hover:from-blue-600 hover:to-indigo-700">
                        <i class="fas fa-redo mr-2"></i>再测一次
                    </button>
                </div>
            </div>
        `;
        renderRadarChart(result.dimensionScores);
    }

    // Calculation functions
    function calculateResult() {
        // Initialize dimension accumulators
        const dimSums = Array(dimensionKeys.length).fill(0);
        const dimCounts = Array(dimensionKeys.length).fill(0);

        // Sum scores from answers
        answers.forEach(answer => {
            const question = questions.find(q => q.id === answer.questionId);
            if (!question) return;

            const option = question.options[answer.optionIndex];
            if (!option) return;

            option.scores.forEach((score, idx) => {
                if (score !== null) {
                    dimSums[idx] += score;
                    dimCounts[idx] += 1;
                }
            });
        });

        // Calculate averages
        const dimensionAverages = dimSums.map((sum, idx) => {
            const count = dimCounts[idx];
            return count > 0 ? sum / count : null;
        });

        // Create dimension score objects
        const dimensionScores = dimensionAverages.map((avg, idx) => ({
            key: dimensionKeys[idx],
            avg: avg,
            label: avg !== null ? getDimensionLabel(idx, avg) : null
        }));

        // Find top 2 dimensions with highest averages
        const scoredDimensions = dimensionScores
            .map((score, idx) => ({ ...score, index: idx }))
            .filter(score => score.avg !== null)
            .sort((a, b) => b.avg - a.avg);

        const topDimensions = scoredDimensions.slice(0, 2).map(score => ({
            key: score.key,
            value: Math.round(score.avg), // 1, 2, or 3
            label: score.label
        }));

        // Find matching personality
        const personalityId = findMatchingPersonality(topDimensions, dimensionScores);

        // Calculate overall match score (0-100)
        const score = Math.round((answers.length / questions.length) * 100);

        result = {
            dimensionScores,
            topDimensions,
            personalityId,
            score
        };
    }

    function getDimensionLabel(dimIndex, avg) {
        const dim = dimensions[dimIndex];
        if (!dim) return '';

        if (avg >= 1.0 && avg <= 1.6) return dim.labels[0]; // 偏左
        if (avg >= 1.7 && avg <= 2.3) return dim.labels[1]; // 平衡
        if (avg >= 2.4 && avg <= 3.0) return dim.labels[2]; // 偏右
        return dim.labels[1]; // default
    }

    function findMatchingPersonality(topDimensions, dimensionScores) {
        // Extract user's dimension labels (all 6 dimensions)
        const userLabels = dimensionScores.map(score => score.label).filter(label => label !== null);

        // If no labels, default to first personality
        if (userLabels.length === 0) {
            return 1;
        }

        // Calculate weights for each personality with more balanced distribution
        const weights = personalities.map(personality => {
            // Parse tags from personality description
            let tags = [];
            if (personality.id === 30) {
                // Personality #30: "全维度平衡" - matches when most dimensions are "平衡"
                tags = ['平衡'];
            } else {
                // Split description by '+' or space to get tags
                tags = personality.description.split(/[+ ]+/).filter(tag => tag.trim().length > 0);
            }

            // Count matching tags
            let matchCount = 0;
            tags.forEach(tag => {
                if (userLabels.includes(tag)) {
                    matchCount++;
                }
            });

            // For personality #30, calculate proportion of "平衡" labels in userLabels
            if (personality.id === 30) {
                const balancedCount = userLabels.filter(label => label === '平衡').length;
                // Match strength based on proportion of balanced dimensions
                matchCount = balancedCount / userLabels.length;
                // Convert to comparable scale (0-3)
                matchCount = matchCount * 3;
            }

            // Weight formula designed to keep probabilities in 1-5% range
            // Base weight: 1.0 (ensures minimum 1% probability after normalization)
            // Match bonus: matchCount * 0.175 (max 0.525 when matchCount=3)
            // This gives max weight of 1.525, min weight of 1.0
            // With 30 personalities, max initial probability ~4.99%
            const weight = 1.0 + matchCount * 0.175;

            return weight;
        });

        // Convert weights to probabilities
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        let probabilities = weights.map(w => w / totalWeight);

        // Apply hard constraints to keep probabilities between 1% and 5%
        const minP = 0.01;
        const maxP = 0.05;
        probabilities = probabilities.map(p => Math.max(minP, Math.min(maxP, p)));

        // Renormalize to sum to 1
        const totalProb = probabilities.reduce((sum, p) => sum + p, 0);
        probabilities = probabilities.map(p => p / totalProb);

        // Weighted random selection based on probabilities
        const rand = Math.random();
        let cumulative = 0;
        for (let i = 0; i < personalities.length; i++) {
            cumulative += probabilities[i];
            if (rand < cumulative) {
                return personalities[i].id;
            }
        }

        // Fallback: return first personality
        return 1;
    }

    // Navigation functions (exposed to global scope)
    window.startTest = function() {
        currentView = 'test';
        currentQuestionIndex = 0;
        answers = [];
        render();
    };

    window.goHome = function() {
        currentView = 'home';
        render();
    };

    window.selectOption = function(optionIndex) {
        const question = questions[currentQuestionIndex];
        const existingAnswerIndex = answers.findIndex(a => a.questionId === question.id);

        if (existingAnswerIndex >= 0) {
            answers[existingAnswerIndex].optionIndex = optionIndex;
            answers[existingAnswerIndex].scores = question.options[optionIndex].scores;
        } else {
            answers.push({
                questionId: question.id,
                optionIndex: optionIndex,
                scores: question.options[optionIndex].scores
            });
        }

        render();

        // Auto-advance to next question after a short delay (unless it's the last question)
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                render();
            } else {
                // Last question, show result
                currentView = 'result';
                render();
            }
        }, 150); // 150ms delay
    };

    window.nextQuestion = function() {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            render();
        } else {
            // Last question, show result
            currentView = 'result';
            render();
        }
    };

    window.prevQuestion = function() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            render();
        }
    };

    window.skipQuestion = function() {
        // Move to next question without answering
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            render();
        } else {
            currentView = 'result';
            render();
        }
    };

    window.restartTest = function() {
        currentView = 'test';
        currentQuestionIndex = 0;
        answers = [];
        result = null;
        render();
    };

    window.shareResult = function(platform) {
        alert(`分享到${platform}功能需要集成社交媒体SDK。\n\n你的结果：${result ? personalities.find(p => p.id === result.personalityId).name : ''}`);
    };

    // Render radar chart for dimension scores
    function renderRadarChart(dimensionScores) {
        const canvas = document.getElementById('radarChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Use global dimensions array for labels
        const dimensionLabels = dimensions.map(dim => {
            // Convert English key to Chinese label
            const map = {
                'play_style': '游戏风格',
                'game_attitude': '游戏态度',
                'think_way': '思考方式',
                'social_role': '社交角色',
                'moral_type': '道德类型',
                'operate_style': '操作风格'
            };
            return map[dim.key] || dim.key;
        });

        const values = dimensionScores.map(score => score.avg !== null ? score.avg : 0);
        const traitLabels = dimensionScores.map(score => score.label || '');

        // Normalize values to 0-100 scale (original 1-3)
        const normalizedValues = values.map(v => ((v - 1) / 2) * 100);

        // Create gradient for the radar area
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: dimensionLabels,
                datasets: [{
                    label: '你的得分',
                    data: normalizedValues,
                    backgroundColor: gradient,
                    borderColor: '#3b82f6',
                    borderWidth: 2,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        min: 0,
                        ticks: {
                            display: false,
                            stepSize: 25
                        },
                        pointLabels: {
                            font: {
                                size: 13,
                                family: "'Inter', sans-serif",
                                weight: '500'
                            },
                            color: '#4b5563'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        angleLines: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const rawValue = values[context.dataIndex];
                                const traitLabel = traitLabels[context.dataIndex];
                                return `${dimensionLabels[context.dataIndex]}: ${rawValue.toFixed(1)} (${traitLabel})`;
                            }
                        }
                    }
                }
            }
        });
    }

    window.viewAllPersonalities = function() {
        alert('显示全部30种人格功能尚未实现。');
    };

    // Initial render
    render();
});