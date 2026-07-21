import { Request, Response } from 'express';

// Valid priority values from the schema
type ValidPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export const analyzeRequest = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required for AI analysis' });
    }

    const titleLower = title.toLowerCase();
    const descLower = description.toLowerCase();
    const fullText = `${titleLower} ${descLower}`;

    let summary = '';
    let suggestedCategory = 'OTHER';
    let suggestedPriority: ValidPriority = 'MEDIUM';
    let reason = '';

    // Network/VPN issues
    if (fullText.includes('vpn') || fullText.includes('vpn connection') || fullText.includes('vpn access')) {
      summary = 'Issues establishing VPN connection to corporate network.';
      suggestedCategory = 'NETWORK';
      suggestedPriority = 'HIGH';
      reason = 'VPN connectivity issues prevent remote staff from accessing secure systems, warranting high priority.';
    } 
    // Internet/WiFi issues
    else if (fullText.includes('internet') || fullText.includes('wifi') || 
             fullText.includes('wi-fi') || fullText.includes('network') || 
             fullText.includes('connection')) {
      summary = 'Internet or Wi-Fi connectivity outage/instability.';
      suggestedCategory = 'NETWORK';
      suggestedPriority = 'MEDIUM';
      reason = 'Affects local work but offline backups or alternative tasks may remain possible.';
    } 
    // Hardware issues
    else if (fullText.includes('laptop') || fullText.includes('computer') || 
             fullText.includes('screen') || fullText.includes('monitor') ||
             fullText.includes('keyboard') || fullText.includes('mouse') ||
             fullText.includes('hardware')) {
      summary = 'Hardware malfunction affecting company device.';
      suggestedCategory = 'HARDWARE';
      suggestedPriority = 'LOW';
      reason = 'Single user hardware issue. Can be resolved via temporary loaner device.';
    } 
    // Access/Permission issues
    else if (fullText.includes('access') || fullText.includes('permission') ||
             fullText.includes('login') || fullText.includes('password') ||
             fullText.includes('credential') || fullText.includes('authentication')) {
      summary = 'Access or permission issue reported.';
      suggestedCategory = 'ACCESS';
      suggestedPriority = 'MEDIUM';
      reason = 'Access issues can affect productivity but can be resolved by admin.';
    }
    // Software issues
    else if (fullText.includes('software') || fullText.includes('application') ||
             fullText.includes('program') || fullText.includes('app') ||
             fullText.includes('install') || fullText.includes('update') ||
             fullText.includes('bug') || fullText.includes('error')) {
      summary = 'Software application issue reported.';
      suggestedCategory = 'SOFTWARE';
      suggestedPriority = 'MEDIUM';
      reason = 'Software issues can be resolved with troubleshooting or updates.';
    }
    // Urgent/emergency keywords
    else if (fullText.includes('urgent') || fullText.includes('emergency') ||
             fullText.includes('critical') || fullText.includes('immediate') ||
             fullText.includes('asap')) {
      summary = 'Urgent support request requiring immediate attention.';
      suggestedCategory = 'OTHER';
      suggestedPriority = 'URGENT';
      reason = 'Urgent keywords detected requiring immediate attention.';
    }
    // Default - General inquiry
    else {
      summary = 'General support inquiry.';
      suggestedCategory = 'OTHER';
      suggestedPriority = 'MEDIUM'; // ✅ FIXED: Changed from 'CRITICAL' to 'MEDIUM'
      reason = 'General inquiry with no specific network, hardware, or access flags.';
    }

    return res.status(200).json({
      summary,
      suggestedCategory,
      suggestedPriority,
      reason,
    });
  } catch (error) {
    console.error('AI Analysis error:', error);
    return res.status(500).json({ 
      error: 'AI Analysis engine failed', 
      details: (error as Error).message 
    });
  }
};