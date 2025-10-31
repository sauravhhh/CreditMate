function validateInputs() {
    const creditLimit = parseFloat(document.getElementById('creditLimit').value);
    const creditUtilized = parseFloat(document.getElementById('creditUtilized').value);
    const utilizedInput = document.getElementById('creditUtilized');
    const errorMessage = document.getElementById('utilizedError');
    
    // Reset error state
    utilizedInput.classList.remove('error');
    errorMessage.classList.remove('show');
    
    // Validate credit limit
    if (isNaN(creditLimit) || creditLimit <= 0) {
        alert('Please enter a valid positive credit limit.');
        return false;
    }
    
    // Validate credit utilized
    if (isNaN(creditUtilized) || creditUtilized < 0) {
        alert('Please enter a valid credit utilized amount.');
        return false;
    }
    
    // Check if utilized exceeds limit
    if (creditUtilized > creditLimit) {
        utilizedInput.classList.add('error');
        errorMessage.classList.add('show');
        return false;
    }
    
    return true;
}

function analyzeCredit() {
    // Validate inputs first
    if (!validateInputs()) {
        return;
    }
    
    // Get input values
    const creditLimit = parseFloat(document.getElementById('creditLimit').value);
    const creditUtilized = parseFloat(document.getElementById('creditUtilized').value);
    
    // Calculate utilization ratio
    const utilizationRatio = (creditUtilized / creditLimit) * 100;
    
    // Calculate available credit
    const availableCredit = creditLimit - creditUtilized;
    
    // Determine credit health status
    let healthStatus, healthClass, healthDescription;
    
    if (utilizationRatio <= 30) {
        healthStatus = 'Excellent';
        healthClass = 'utilization-low';
        healthDescription = 'Great job! Your utilization is in the optimal range.';
    } else if (utilizationRatio <= 50) {
        healthStatus = 'Good';
        healthClass = 'utilization-medium';
        healthDescription = 'Your utilization is acceptable but could be improved.';
    } else if (utilizationRatio <= 70) {
        healthStatus = 'Fair';
        healthClass = 'utilization-medium';
        healthDescription = 'Your utilization is getting high. Consider reducing it.';
    } else {
        healthStatus = 'Poor';
        healthClass = 'utilization-high';
        healthDescription = 'Your utilization is too high. This may negatively impact your credit score.';
    }
    
    // Update progress bar with animation
    const progressFill = document.getElementById('progressFill');
    setTimeout(() => {
        progressFill.style.width = Math.min(utilizationRatio, 100) + '%';
    }, 100);
    
    // Update progress bar color
    progressFill.className = 'progress-fill';
    if (utilizationRatio <= 30) {
        progressFill.classList.add('progress-low');
    } else if (utilizationRatio <= 70) {
        progressFill.classList.add('progress-medium');
    } else {
        progressFill.classList.add('progress-high');
    }
    
    // Display results
    document.getElementById('utilizationRatio').textContent = utilizationRatio.toFixed(1) + '%';
    document.getElementById('utilizationRatio').className = 'metric-value ' + healthClass;
    document.getElementById('utilizationDescription').textContent = `You're using ${utilizationRatio.toFixed(1)}% of your available credit`;
    document.getElementById('availableCredit').textContent = '₹' + availableCredit.toLocaleString('en-IN');
    document.getElementById('healthStatus').textContent = healthStatus;
    document.getElementById('healthStatus').className = 'metric-value ' + healthClass;
    document.getElementById('healthDescription').textContent = healthDescription;
    
    // Show results
    document.getElementById('results').style.display = 'block';
    
    // Store values for sharing
    window.lastAnalysis = {
        creditLimit: creditLimit,
        creditUtilized: creditUtilized,
        utilizationRatio: utilizationRatio.toFixed(1) + '%',
        availableCredit: '₹' + availableCredit.toLocaleString('en-IN'),
        healthStatus: healthStatus
    };
}

function showShareSheet() {
    document.getElementById('overlay').classList.add('active');
    document.getElementById('shareSheet').classList.add('active');
}

function hideShareSheet() {
    document.getElementById('overlay').classList.remove('active');
    document.getElementById('shareSheet').classList.remove('active');
}

function copyToClipboard() {
    if (!window.lastAnalysis) return;
    
    const analysis = window.lastAnalysis;
    
    const shareText = `📊 Credit Analysis

💳 Credit Limit: ₹${analysis.creditLimit.toLocaleString('en-IN')}
💰 Credit Utilized: ₹${analysis.creditUtilized.toLocaleString('en-IN')}
📈 Utilization Ratio: ${analysis.utilizationRatio}
💎 Available Credit: ${analysis.availableCredit}
🏥 Credit Health: ${analysis.healthStatus}

Analyze your credit: https://sauravhhh.github.io/SliceRate`;
    
    navigator.clipboard.writeText(shareText).then(() => {
        hideShareSheet();
        // Show iOS-style confirmation
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 20px;
            font-size: 15px;
            z-index: 2000;
        `;
        toast.textContent = 'Copied to clipboard';
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 2000);
    });
}

function shareToNative() {
    if (!window.lastAnalysis) return;
    
    const analysis = window.lastAnalysis;
    
    const shareText = `📊 Credit Analysis

💳 Credit Limit: ₹${analysis.creditLimit.toLocaleString('en-IN')}
💰 Credit Utilized: ₹${analysis.creditUtilized.toLocaleString('en-IN')}
📈 Utilization Ratio: ${analysis.utilizationRatio}
💎 Available Credit: ${analysis.availableCredit}
🏥 Credit Health: ${analysis.healthStatus}

Analyze your credit: https://sauravhhh.github.io/SliceRate`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Credit Analysis',
            text: shareText
        }).then(() => {
            hideShareSheet();
        }).catch(err => {
            console.log('Error sharing:', err);
        });
    } else {
        copyToClipboard();
    }
}

// Add real-time validation
document.getElementById('creditUtilized').addEventListener('input', function() {
    const creditLimit = parseFloat(document.getElementById('creditLimit').value);
    const creditUtilized = parseFloat(this.value);
    const errorMessage = document.getElementById('utilizedError');
    
    if (!isNaN(creditLimit) && !isNaN(creditUtilized) && creditUtilized > creditLimit) {
        this.classList.add('error');
        errorMessage.classList.add('show');
    } else {
        this.classList.remove('error');
        errorMessage.classList.remove('show');
    }
});

document.getElementById('creditLimit').addEventListener('input', function() {
    const creditLimit = parseFloat(this.value);
    const creditUtilized = parseFloat(document.getElementById('creditUtilized').value);
    const errorMessage = document.getElementById('utilizedError');
    const utilizedInput = document.getElementById('creditUtilized');
    
    if (!isNaN(creditLimit) && !isNaN(creditUtilized) && creditUtilized > creditLimit) {
        utilizedInput.classList.add('error');
        errorMessage.classList.add('show');
    } else {
        utilizedInput.classList.remove('error');
        errorMessage.classList.remove('show');
    }
});
